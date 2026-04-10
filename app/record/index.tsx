import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useRecording } from '../../hooks/useRecording';
import { useAudio } from '../../hooks/useAudio';
import { getBackchatAsync } from '../../lib/api/claude';
import RecordButton from '../../components/RecordButton';
import WaveformAnimation from '../../components/WaveformAnimation';
import AiBackchatBubble from '../../components/AiBackchatBubble';
import * as Haptics from 'expo-haptics';

// プレミアムフラグ（RevenueCat接続後に動的取得）
const IS_PREMIUM = false;

export default function RecordScreen() {
  const router = useRouter();
  const { pauseBGM, resumeBGM, playSE } = useAudio();
  const [showPaywall, setShowPaywall] = useState(false);
  const [backchatMessages, setBackchatMessages] = useState<string[]>([]);
  const backchatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const partialTranscriptRef = useRef('');
  const scrollRef = useRef<ScrollView>(null);

  const handleLimitReached = useCallback(() => {
    playSE('stop');
    setShowPaywall(true);
  }, [playSE]);

  const {
    state,
    elapsedSeconds,
    audioUri,
    remainingFreeSeconds,
    isNearLimit,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording(IS_PREMIUM, handleLimitReached);

  useEffect(() => {
    return () => {
      if (backchatTimerRef.current) clearInterval(backchatTimerRef.current);
    };
  }, []);

  // 録音開始時に BGM を一時停止し、20秒ごとに相づちを取得
  useEffect(() => {
    if (state === 'recording') {
      pauseBGM();
      playSE('start');

      // 20秒ごとに相づちをフェッチ
      backchatTimerRef.current = setInterval(async () => {
        const backchat = await getBackchatAsync(
          partialTranscriptRef.current || '（録音中）'
        );
        setBackchatMessages((prev) => [...prev, backchat]);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 20000);
    } else if (state === 'idle' || state === 'processing') {
      if (backchatTimerRef.current) {
        clearInterval(backchatTimerRef.current);
        backchatTimerRef.current = null;
      }
      if (state === 'idle') resumeBGM();
    }
  }, [state, pauseBGM, resumeBGM, playSE]);

  // 録音完了後に result 画面へ遷移
  useEffect(() => {
    if (audioUri && state === 'processing') {
      playSE('stop');
      router.replace({
        pathname: '/record/result',
        params: { audioUri, durationSeconds: String(elapsedSeconds) },
      });
    }
  }, [audioUri, state, elapsedSeconds, router, playSE]);

  const handleButtonPress = useCallback(async () => {
    if (state === 'idle') {
      setBackchatMessages([]);
      await startRecording();
    } else if (state === 'recording') {
      await stopRecording();
    }
  }, [state, startRecording, stopRecording]);

  const handleDiscard = useCallback(() => {
    resetRecording();
    resumeBGM();
    router.back();
  }, [resetRecording, resumeBGM, router]);

  if (showPaywall) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.paywallPrompt}>
          <Text style={styles.paywallTitle} accessibilityRole="header">
            3分を超えました
          </Text>
          <Text style={styles.paywallBody}>
            今日の話が途中で切れてしまいました。{'\n'}
            プレミアムなら無制限で録音できます。
          </Text>
          <Text style={styles.paywallPrice}>月額580円（1日あたり約19円）</Text>
          <Pressable
            style={styles.upgradeButton}
            onPress={() => router.replace('/paywall')}
            accessibilityRole="button"
            accessibilityLabel="プレミアムプランにアップグレードする"
          >
            <Text style={styles.upgradeButtonText}>プレミアムにアップグレード</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={handleDiscard}
            accessibilityRole="button"
            accessibilityLabel="今回はキャンセルしてホームに戻る"
          >
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const elapsedMin = Math.floor(elapsedSeconds / 60);
  const elapsedSec = elapsedSeconds % 60;
  const timerStr = `${String(elapsedMin).padStart(2, '0')}:${String(elapsedSec).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* タイマー */}
        <Text
          style={styles.timer}
          accessibilityLabel={`録音時間 ${timerStr}`}
          accessibilityLiveRegion="polite"
        >
          {timerStr}
        </Text>

        {/* 波形 */}
        <View style={styles.waveformContainer}>
          <WaveformAnimation isActive={state === 'recording'} />
        </View>

        {/* AI相づちバブル */}
        <View style={styles.backchatSection}>
          {backchatMessages.length === 0 && state === 'idle' && (
            <Text style={styles.startHint}>
              ボタンをタップして話しかけてください
            </Text>
          )}
          {backchatMessages.map((msg, i) => (
            <AiBackchatBubble key={i} text={msg} isStreaming={i === backchatMessages.length - 1} />
          ))}
        </View>
      </ScrollView>

      {/* 録音ボタン（画面下部に固定） */}
      <View style={styles.buttonContainer}>
        {isNearLimit && (
          <Text
            style={styles.limitWarning}
            accessibilityLiveRegion="assertive"
          >
            あと {remainingFreeSeconds}秒で無料プランの上限です
          </Text>
        )}
        <RecordButton
          state={state}
          onPress={handleButtonPress}
          remainingSeconds={remainingFreeSeconds}
          isNearLimit={isNearLimit}
        />
        {state === 'idle' && (
          <Pressable
            style={styles.discardButton}
            onPress={handleDiscard}
            accessibilityRole="button"
            accessibilityLabel="キャンセルしてホームに戻る"
          >
            <Text style={styles.discardText}>キャンセル</Text>
          </Pressable>
        )}
      </View>
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
    paddingTop: 32,
    paddingBottom: 20,
    gap: 24,
  },
  timer: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: '200',
    textAlign: 'center',
    letterSpacing: 4,
  },
  waveformContainer: {
    alignItems: 'center',
  },
  backchatSection: {
    gap: 12,
    minHeight: 80,
  },
  startHint: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.glassCardBorder,
  },
  limitWarning: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  discardButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  discardText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  // Paywall表示時
  paywallPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  paywallTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  paywallBody: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  paywallPrice: {
    color: Colors.primaryLight,
    fontSize: 18,
    fontWeight: '700',
  },
  upgradeButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});
