import {
  KOETOMO_SYSTEM_PROMPT,
  BACKCHAT_ONLY_PROMPT,
  buildDiaryPrompt,
  buildBackchatPrompt,
} from '../prompts/koetomo';
import type { EmotionType } from '../../constants/colors';

export type DiaryAnalysis = {
  backchat: string;
  diary: string;
  emotion_primary: EmotionType;
  emotion_score: number;
  emotion_tags: string[];
};

/**
 * 録音完了後に Whisper 文字起こし結果を Claude に送信し
 * 相づち・日記テキスト・感情分析を一括取得する
 */
export async function analyzeDiary(transcription: string): Promise<DiaryAnalysis> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[Claude] ANTHROPIC_API_KEY が設定されていません。モックデータを返します。');
    return getMockAnalysis(transcription);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: KOETOMO_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildDiaryPrompt(transcription),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${errText}`);
    }

    const data = (await response.json()) as {
      content: { type: string; text: string }[];
    };
    const text = data.content?.[0]?.text ?? '{}';

    // JSONブロックを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON not found in response');

    const parsed = JSON.parse(jsonMatch[0]) as DiaryAnalysis;
    return {
      backchat: parsed.backchat ?? 'お話を聞かせてくれてありがとう。',
      diary: parsed.diary ?? transcription,
      emotion_primary: parsed.emotion_primary ?? 'calm',
      emotion_score: parsed.emotion_score ?? 0.5,
      emotion_tags: parsed.emotion_tags ?? [],
    };
  } catch (e) {
    console.warn('[Claude] 分析失敗:', e);
    return getMockAnalysis(transcription);
  }
}

/**
 * 録音中のリアルタイム相づち取得（短文・非同期）
 */
export async function getBackchatAsync(partialTranscript: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) return getMockBackchat();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 60,
        system: BACKCHAT_ONLY_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildBackchatPrompt(partialTranscript),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Claude backchat error: ${response.status}`);

    const data = (await response.json()) as {
      content: { type: string; text: string }[];
    };
    return data.content?.[0]?.text?.trim() ?? getMockBackchat();
  } catch (e) {
    console.warn('[Claude] 相づち失敗:', e);
    return getMockBackchat();
  }
}

function getMockBackchat(): string {
  const backchatOptions = [
    'そうなんですね。',
    'それは大変でしたね。',
    '続きを聞かせてください。',
    'どんな気持ちでしたか？',
    'なるほど、そんなことが。',
  ];
  return backchatOptions[Math.floor(Math.random() * backchatOptions.length)];
}

function getMockAnalysis(transcription: string): DiaryAnalysis {
  return {
    backchat: '今日のお話、聞かせてくれてありがとう。お疲れ様でした。',
    diary: `${transcription.slice(0, 100)}...今日も一日お疲れ様でした。`,
    emotion_primary: 'calm',
    emotion_score: 0.5,
    emotion_tags: ['日常', '疲れ', '前向き'],
  };
}
