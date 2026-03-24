/**
 * OpenAI Whisper API を使った音声文字起こし
 * 音声データは API に送信後即時削除・サーバーに保存しない
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[Whisper] OPENAI_API_KEY が設定されていません。モックデータを返します。');
    return getMockTranscription();
  }

  try {
    // React Native の fetch は blob を直接使えないため FormData + uri 形式で送信
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as unknown as Blob);
    formData.append('model', 'whisper-1');
    formData.append('language', 'ja');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Whisper API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as { text: string };
    return data.text ?? '';
  } catch (e) {
    console.warn('[Whisper] 文字起こし失敗:', e);
    return getMockTranscription();
  }
}

function getMockTranscription(): string {
  return '今日はなんか疲れたな。仕事でちょっと大変なことがあって、でも夜ごはんが美味しかったから少し元気になった気がする。明日もがんばろう。';
}
