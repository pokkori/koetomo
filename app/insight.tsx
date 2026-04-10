import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Share,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { EMOTIONS, getEmotionById } from '../constants/emotions';
import {
  getWeeklyStats,
  getPreviousWeekStats,
  getDominantEmotionThisWeek,
  getRecentEntries,
} from '../lib/emotionLog';
import GlassCard from '../components/GlassCard';
import WeeklyBarChart from '../components/WeeklyBarChart';
import * as Haptics from 'expo-haptics';
import { useRewardedAd } from '../hooks/useAdMob';

// 傾聴型AIコメント（ネガティブを否定しない）
const AI_INSIGHTS: Record<string, string> = {
  joy: 'うれしい気持ちがあふれていた週でしたね。その感情をしっかり受け取りました。',
  anger: '怒りを感じることがありましたね。そう感じるのには、きっと理由があります。',
  sadness: '悲しい気持ちと向き合った週でした。そのままの感情でいて、よかったです。',
  anxiety: '不安を抱えながらも、記録を続けてくれましたね。それだけで十分です。',
  tired: '疲れが溜まっていた週でしたね。ゆっくり休む時間を大切にしてください。',
  calm: 'おだやかに過ごせた週でしたね。その静けさを、ここでも感じました。',
  happy: '幸せな気持ちが多かった週でした。その瞬間を覚えていてください。',
};

const FALLBACK_INSIGHT = '今週もコエトモに話しかけてくれてありがとうございます。あなたの声を、ちゃんと受け取っています。';

// カード入場アニメーションラッパー
function AnimatedCard({
  children,
  index,
  style,
}: {
  children: React.ReactNode;
  index: number;
  style?: object;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * 150;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 20, stiffness: 200 })
    );
  }, [index]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animStyle, style]}>
      {children}
    </Animated.View>
  );
}

export default function InsightScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState<Record<string, number>>({});
  const [prevStats, setPrevStats] = useState<Record<string, number>>({});
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [weekly, prev, dominant, entries] = await Promise.all([
          getWeeklyStats(),
          getPreviousWeekStats(),
          getDominantEmotionThisWeek(),
          getRecentEntries(7),
        ]);
        setWeeklyStats(weekly);
        setPrevStats(prev);
        setDominantEmotion(dominant);
        setTotalCount(entries.length);
      } catch {
        // サイレントフォールバック
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const dominantEmotionData = dominantEmotion ? getEmotionById(dominantEmotion) : null;
  const aiInsight = dominantEmotion ? (AI_INSIGHTS[dominantEmotion] ?? FALLBACK_INSIGHT) : FALLBACK_INSIGHT;

  const getComparisonText = useCallback((): string | null => {
    if (!dominantEmotion) return null;
    const thisWeekCount = weeklyStats[dominantEmotion] ?? 0;
    const prevWeekCount = prevStats[dominantEmotion] ?? 0;
    if (prevWeekCount === 0) return null;
    const diff = thisWeekCount - prevWeekCount;
    if (diff === 0) return null;
    const label = dominantEmotionData?.label ?? '';
    if (diff > 0) {
      return `先週より${label}が${diff}回増えました`;
    }
    return `先週より${label}が${Math.abs(diff)}回少なくなりました`;
  }, [dominantEmotion, weeklyStats, prevStats, dominantEmotionData]);

  const handleShare = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const emotionLabel = dominantEmotionData?.label ?? '様々な気持ち';
      const message = `今週の感情: ${emotionLabel}が多めでした。コエトモで感情を記録しています。`;
      await Share.share({
        message,
        title: 'コエトモ 今週のインサイト',
      });
    } catch {
      // キャンセル等はサイレント
    }
  }, [dominantEmotionData]);

  const { isLoaded: adLoaded, showAd } = useRewardedAd();
  const handleWatchAd = useCallback(() => {
    showAd(() => {});
  }, [showAd]);

  const handleShareX = useCallback(async () => {
    const emotionLabel = dominantEmotionData?.label ?? '様々な気持ち';
    const msg = encodeURIComponent(`今週の感情: ${emotionLabel}が多めでした。コエトモで感情を記録中 #コエトモ`);
    await Linking.openURL(`https://twitter.com/intent/tweet?text=${msg}`);
  }, [dominantEmotionData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  const comparisonText = getComparisonText();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="前の画面に戻る"
        >
          <Text style={styles.backText}>← 戻る</Text>
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          今週のインサイト
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 今週の感情サマリー */}
        <AnimatedCard index={0}>
          <GlassCard variant="elevated" style={styles.summaryCard}>
            <Text style={styles.sectionLabel}>今週の感情まとめ</Text>
            {dominantEmotionData ? (
              <>
                <Text
                  style={[styles.dominantEmotion, { color: dominantEmotionData.color }]}
                  accessibilityLabel={`今週最も多かった感情: ${dominantEmotionData.label}`}
                >
                  今週最も多かった感情: {dominantEmotionData.label}
                </Text>
                {comparisonText && (
                  <Text
                    style={styles.comparisonText}
                    accessibilityLabel={comparisonText}
                  >
                    {comparisonText}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.noDataText}>
                まだ今週の記録がありません
              </Text>
            )}
            <Text style={styles.recordCount} accessibilityLabel={`今週の記録: ${totalCount}件`}>
              今週の記録: {totalCount}件
            </Text>
          </GlassCard>
        </AnimatedCard>

        {/* 感情分布棒グラフ */}
        <AnimatedCard index={1}>
          <GlassCard style={styles.graphCard}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              今週の感情分布
            </Text>
            <WeeklyBarChart stats={weeklyStats} />
          </GlassCard>
        </AnimatedCard>

        {/* AIからひとこと */}
        <AnimatedCard index={2}>
          <GlassCard variant="elevated" style={styles.aiCard}>
            <Text style={styles.aiLabel} accessibilityRole="header">
              コエトモからひとこと
            </Text>
            <Text style={styles.aiText} accessibilityLabel={`AIコメント: ${aiInsight}`}>
              {aiInsight}
            </Text>
          </GlassCard>
        </AnimatedCard>

        {/* 感情別内訳リスト */}
        <AnimatedCard index={3}>
          <GlassCard style={styles.breakdownCard}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              感情の内訳
            </Text>
            {EMOTIONS.map((emotion) => {
              const count = weeklyStats[emotion.id] ?? 0;
              const maxVal = Math.max(...Object.values(weeklyStats), 1);
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <View
                  key={emotion.id}
                  style={styles.breakdownRow}
                  accessibilityLabel={`${emotion.label}: ${count}回 (${pct}%)`}
                >
                  <View
                    style={[styles.colorDot, { backgroundColor: emotion.color }]}
                    accessible={false}
                  />
                  <Text style={styles.breakdownLabel}>{emotion.label}</Text>
                  <View style={styles.breakdownBarTrack} accessible={false}>
                    <View
                      style={[
                        styles.breakdownBarFill,
                        {
                          width: count > 0 ? `${(count / maxVal) * 100}%` : '0%',
                          backgroundColor: emotion.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownCount}>{count}回</Text>
                </View>
              );
            })}
          </GlassCard>
        </AnimatedCard>

        {/* Xシェアボタン */}
        <AnimatedCard index={4}>
          <Pressable
            style={styles.shareButton}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="今週のインサイトをシェアする"
            accessibilityHint="Xなどのアプリでシェアできます"
          >
            <Text style={styles.shareButtonText}>今週のインサイトをシェア</Text>
          </Pressable>
        </AnimatedCard>

        {/* Xに投稿ボタン */}
        <AnimatedCard index={5}>
          <Pressable
            style={styles.xShareButton}
            onPress={handleShareX}
            accessibilityRole="button"
            accessibilityLabel="Xに投稿する"
          >
            <Text style={styles.xShareButtonText}>Xに投稿</Text>
          </Pressable>
        </AnimatedCard>

        {/* 広告リワードボタン */}
        {adLoaded && (
          <AnimatedCard index={6}>
            <Pressable
              style={styles.adRewardButton}
              onPress={handleWatchAd}
              accessibilityRole="button"
              accessibilityLabel="広告を見て特典を獲得する"
            >
              <Text style={styles.adRewardButtonText}>広告で特別機能をアンロック</Text>
            </Pressable>
          </AnimatedCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    color: Colors.primaryLight,
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  headerRight: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    gap: 8,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dominantEmotion: {
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 26,
  },
  comparisonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  noDataText: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  recordCount: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  graphCard: {
    gap: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  aiCard: {
    gap: 10,
  },
  aiLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  aiText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  breakdownCard: {
    gap: 0,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  breakdownLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    width: 44,
    flexShrink: 0,
  },
  breakdownBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownCount: {
    color: Colors.textMuted,
    fontSize: 12,
    width: 28,
    textAlign: 'right',
    flexShrink: 0,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  xShareButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  xShareButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  adRewardButton: {
    backgroundColor: '#FFB300',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  adRewardButtonText: {
    color: '#1A1A2E',
    fontSize: 15,
    fontWeight: '700',
  },
});
