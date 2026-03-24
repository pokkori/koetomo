import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { transcribeAudio } from '../../lib/api/whisper';
import { analyzeDiary, type DiaryAnalysis } from '../../lib/api/claude';
import { updateStreakAsync, shouldShowStreakMilestone } from '../../lib/streak';
import { sendStreakMilestoneNotification } from '../../lib/notifications/koetomo';
import { useAudio } from '../../hooks/useAudio';
import EmotionTag from '../../components/EmotionTag';
import GlassCard from '../../components/GlassCard';
import StreakBadge from '../../components/StreakBadge';
import ShareEmotionCard from '../../components/ShareEmotionCard';

type Step = 'transcribing' | 'analyzing' | 'done' | 'error';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    audioUri: string;
    durationSeconds: string;
  }>();
  const { playSE, resumeBGM } = useAudio();

  const [step, setStep] = useState<Step>('transcribing');
  const [transcription, setTranscription] = useState('');
  const [analysis, setAnalysis] = useState<DiaryAnalysis | null>(null);
  const [streak, setStreak] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function process() {
      try {
        // Whisper 文字起こし
        setStep('transcribing');
        const text = await transcribeAudio(params.audioUri ?? '');
        setTranscription(text);

        // Claude 分析
        setStep('analyzing');
        const result = await analyzeDiary(text);
        setAnalysis(result);

        // ストリーク更新
        const newStreak = await updateStreakAsync();
        setStreak(newStreak);

        // マイルストーン通知
        if (shouldShowStreakMilestone(newStreak)) {
          await sendStreakMilestoneNotification(newStreak);
        }

        setStep('done');
        await playSE('save');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        resumeBGM();
      } catch (e) {
        console.error('[Result] 処理失敗:', e);
        setErrorMessage('日記の作成に失敗しました。もう一度お試しください。');
        setStep('error');
        resumeBGM();
      }
    }
    process();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (step === 'transcribing' || step === 'analyzing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer} accessibilityLiveRegion="polite">
          <ActivityIndicator size="large" color={Colors.primaryLight} />
          <Text style={styles.loadingText}>
            {step === 'transcribing' ? '声を文字に変換しています...' : 'AIが日記を作成しています...'}
          </Text>
          <Text style={styles.loadingSubText}>
            {step === 'transcribing'
              ? 'Whisper AIが音声を解析中'
              : 'コエトモがあなたの気持ちを読み取り中'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {errorMessage}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="ホームに戻る"
          >
            <Text style={styles.retryButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const durationSec = parseInt(params.durationSeconds ?? '0', 10);
  const durationMin = Math.floor(durationSec / 60);
  const durationRemain = durationSec % 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* AI相づち */}
        {analysis?.backchat && (
          <GlassCard style={styles.backchatCard} variant="elevated">
            <View style={styles.backchatHeader} accessible={false}>
              <View style={styles.avatarDot} />
              <Text style={styles.backchatLabel}>コエトモより</Text>
            </View>
            <Text
              style={styles.backchatText}
              accessibilityLabel={`コエトモ: ${analysis.backchat}`}
            >
              {analysis.backchat}
            </Text>
          </GlassCard>
        )}

        {/* 感情 + ストリーク */}
        <View style={styles.metaRow}>
          {analysis && <EmotionTag emotion={analysis.emotion_primary} />}
          {streak > 0 && <StreakBadge streak={streak} />}
        </View>

        {/* AI生成日記 */}
        <GlassCard>
          <Text style={styles.sectionLabel} accessibilityRole="header">
            今日の日記
          </Text>
          <Text
            style={styles.diaryText}
            accessibilityLabel={`今日の日記: ${analysis?.diary ?? ''}`}
          >
            {analysis?.diary ?? ''}
          </Text>
        </GlassCard>

        {/* タグ */}
        {(analysis?.emotion_tags ?? []).length > 0 && (
          <View style={styles.tagsRow} accessibilityLabel="感情タグ">
            {(analysis?.emotion_tags ?? []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 文字起こし原文 */}
        <GlassCard>
          <Text style={styles.sectionLabel} accessibilityRole="header">
            あなたの言葉（原文）
          </Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
          <Text style={styles.durationText} accessibilityElementsHidden>
            録音時間: {durationMin > 0 ? `${durationMin}分` : ''}{durationRemain}秒
          </Text>
        </GlassCard>

        {/* シェアカード */}
        {analysis && (
          <ShareEmotionCard
            emotion={analysis.emotion_primary}
            diarySnippet={analysis.diary}
            streakDays={streak}
          />
        )}

        {/* アクションボタン */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="ホームに戻る"
          >
            <Text style={styles.primaryButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/history')}
            accessibilityRole="button"
            accessibilityLabel="日記一覧を見る"
          >
            <Text style={styles.secondaryButtonText}>日記一覧を見る</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minHeight: 44,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backchatCard: {
    gap: 10,
  },
  backchatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
  },
  backchatLabel: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backchatText: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  diaryText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  transcriptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  durationText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
