import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { getStreakAsync, isOnboardingDoneAsync } from '../../lib/streak';
import { useAudio } from '../../hooks/useAudio';
import { scheduleDailyRemindersAsync } from '../../lib/notifications/koetomo';
import RecordButton from '../../components/RecordButton';
import StreakBadge from '../../components/StreakBadge';
import GlassCard from '../../components/GlassCard';
import CoachMark from '../../components/CoachMark';
import SoundOnSVG from '../../components/svg/SoundOnSVG';
import SoundOffSVG from '../../components/svg/SoundOffSVG';
import TodayEmotionCard from '../../components/TodayEmotionCard';
import InsightSVG from '../../components/svg/InsightSVG';
import { saveEmotionEntry, getTodayEntry } from '../../lib/emotionLog';
import { getEmotionById, type EmotionCategory } from '../../constants/emotions';
import WelcomeBackModal, { checkWelcomeBack } from '../../components/WelcomeBackModal';

const TODAY_MESSAGES = [
  'あなたの話を聞かせてください',
  '今日はどんな一日でしたか？',
  'どんな気持ちも、ここで話せます',
  '1分だけ話すだけでOKです',
];

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [showCoachMark, setShowCoachMark] = useState(false);
  const [todayEmotion, setTodayEmotion] = useState<EmotionCategory | null>(null);
  const { loadBGM, toggleMute, isMuted } = useAudio();
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeResult, setWelcomeResult] = useState<{ shouldShow: boolean; hoursAway: number; bonusCoins: number; message: string }>({ shouldShow: false, hoursAway: 0, bonusCoins: 0, message: '' });
  const todayMessage = TODAY_MESSAGES[new Date().getDay() % TODAY_MESSAGES.length];

  useEffect(() => {
    loadBGM();
    getStreakAsync().then(setStreak);
    checkWelcomeBack().then((r) => { if (r.shouldShow) { setWelcomeResult(r); setWelcomeVisible(true); } });
    scheduleDailyRemindersAsync().catch(() => {});

    // 今日の感情記録を読み込む
    getTodayEntry().then((entry) => {
      if (entry) {
        const emotion = getEmotionById(entry.emotion);
        if (emotion) setTodayEmotion(emotion);
      }
    }).catch(() => {});

    // オンボーディング完了直後のみコーチマークを表示
    isOnboardingDoneAsync().then((done) => {
      if (done) {
        const shown = (global as Record<string, unknown>).__coachMarkShown;
        if (!shown) {
          (global as Record<string, unknown>).__coachMarkShown = true;
          setTimeout(() => setShowCoachMark(true), 500);
        }
      }
    });
  }, [loadBGM]);

  const handleRecord = useCallback(() => {
    router.push('/record');
  }, [router]);

  const handleEmotionSelect = useCallback(async (emotion: EmotionCategory) => {
    setTodayEmotion(emotion);
    try {
      await saveEmotionEntry({
        date: new Date().toISOString(),
        emotion: emotion.id,
        note: '',
        intensity: 3,
      });
    } catch {
      // 保存失敗してもUI反映は維持
    }
  }, []);

  const handleInsightPress = useCallback(() => {
    router.push('/insight');
  }, [router]);

  return (
    <LinearGradient colors={[Colors.background, '#E8D5F0', '#D5C8F0']} style={styles.gradient}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <Animated.View entering={FadeInDown.delay(0).duration(500).springify()} style={styles.header}>
          <Text style={styles.appName}>コエトモ</Text>
          <View style={styles.headerActions}>
            {/* インサイトへのショートカット */}
            <Pressable
              onPress={handleInsightPress}
              style={({ pressed }) => [styles.insightButton, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityRole="button"
              accessibilityLabel="今週のインサイトを見る"
              accessibilityHint="感情分布グラフと週次レポートを表示します"
            >
              <InsightSVG size={22} color={Colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={toggleMute}
              style={({ pressed }) => [styles.muteButton, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? 'サウンドをオンにする' : 'サウンドをミュートにする'}
            >
              {isMuted ? <SoundOffSVG /> : <SoundOnSVG />}
            </Pressable>
          </View>
        </Animated.View>

        {/* ストリーク */}
        <View style={styles.streakRow}>
          <StreakBadge streak={streak} />
        </View>

        {/* 今日の感情記録CTA */}
        <TodayEmotionCard
          todayEmotion={todayEmotion}
          onSelect={handleEmotionSelect}
        />

        {/* メインキャッチコピー */}
        <GlassCard style={styles.messageCard} variant="elevated">
          <Text style={styles.messageTitle} accessibilityRole="header">
            {todayMessage}
          </Text>
          <Text style={styles.messageSubtitle}>
            話すだけで、AIが日記に変えてくれます
          </Text>
        </GlassCard>

        {/* 録音ボタン（メインアクション） */}
        <View style={styles.recordSection}>
          <RecordButton
            state="idle"
            onPress={handleRecord}
            remainingSeconds={null}
            isNearLimit={false}
          />
        </View>

        {/* 使い方ヒント */}
        <GlassCard style={styles.hintCard}>
          <Text style={styles.hintTitle} accessibilityRole="header">
            使い方
          </Text>
          {HINTS.map((hint, i) => (
            <View key={i} style={styles.hintRow}>
              <View style={styles.hintNumber} accessible={false}>
                <Text style={styles.hintNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          ))}
        </GlassCard>

        {/* 無料プランの説明 */}
        <View style={styles.planInfo} accessibilityLabel="無料プランの説明">
          <Text style={styles.planText}>
            無料プランは1日3分まで録音できます
          </Text>
          <Pressable
            onPress={() => router.push('/paywall')}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="プレミアムプランの詳細を見る"
          >
            <Text style={styles.planLink}>プレミアムにアップグレード</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* コーチマーク（初回のみ） */}
      <CoachMark
        visible={showCoachMark}
        onDismiss={() => setShowCoachMark(false)}
      />
      <WelcomeBackModal
        visible={welcomeVisible}
        result={welcomeResult}
        onClose={() => setWelcomeVisible(false)}
      />
    </SafeAreaView>
    </LinearGradient>
  );
}

const HINTS = [
  'ボタンをタップしてマイクを起動',
  '今日の気持ちや出来事を話しかける',
  'ボタンを再タップして録音を停止',
  'AIが自動で日記テキストに変換',
];

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  appName: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(124,58,237,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    alignItems: 'flex-start',
  },
  messageCard: {
    gap: 8,
  },
  messageTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  messageSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  recordSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  hintCard: {
    gap: 12,
  },
  hintTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hintNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hintNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  hintText: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  planInfo: {
    alignItems: 'center',
    gap: 4,
  },
  planText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  planLink: {
    color: Colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
