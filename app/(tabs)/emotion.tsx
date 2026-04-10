import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, type EmotionType } from '../../constants/colors';
import { supabase, type DiaryEntry } from '../../lib/supabase';
import EmotionGraph from '../../components/EmotionGraph';
import GlassCard from '../../components/GlassCard';
import InsightSVG from '../../components/svg/InsightSVG';

// プレミアムフラグ（RevenueCat接続後に動的取得）
const IS_PREMIUM = false;

type GraphPoint = {
  date: string;
  emotion: EmotionType;
  score: number;
};

const MOCK_GRAPH_DATA: GraphPoint[] = [
  { date: '2026-03-18', emotion: 'calm', score: 0.5 },
  { date: '2026-03-19', emotion: 'happy', score: 0.8 },
  { date: '2026-03-20', emotion: 'anxious', score: 0.6 },
  { date: '2026-03-21', emotion: 'sad', score: 0.4 },
  { date: '2026-03-22', emotion: 'calm', score: 0.55 },
  { date: '2026-03-23', emotion: 'happy', score: 0.7 },
  { date: '2026-03-24', emotion: 'calm', score: 0.6 },
];

const EMOTION_SUMMARY: Record<EmotionType, string> = {
  happy: 'うれしい気持ちが多い週でした',
  calm: 'おだやかに過ごせた週でした',
  anxious: '不安を感じることが多い週でした',
  sad: '落ち込む場面が多い週でした',
  angry: 'イライラすることが多い週でした',
};

export default function EmotionScreen() {
  const router = useRouter();
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dominantEmotion, setDominantEmotion] = useState<EmotionType>('calm');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('diary_entries')
          .select('created_at, emotion_primary, emotion_score')
          .order('created_at', { ascending: true })
          .limit(30);

        if (error || !data || data.length === 0) {
          setGraphData(MOCK_GRAPH_DATA);
          setDominantEmotion('calm');
        } else {
          const points = (data as DiaryEntry[]).map((d) => ({
            date: d.created_at.slice(0, 10),
            emotion: d.emotion_primary,
            score: d.emotion_score ?? 0.5,
          }));
          setGraphData(points);

          // 最も多い感情を計算
          const emotionCount: Record<string, number> = {};
          points.forEach((p) => {
            emotionCount[p.emotion] = (emotionCount[p.emotion] ?? 0) + 1;
          });
          const dominant = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];
          if (dominant) setDominantEmotion(dominant[0] as EmotionType);
        }
      } catch {
        setGraphData(MOCK_GRAPH_DATA);
        setDominantEmotion('calm');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 週次サマリー */}
        <GlassCard variant="elevated" style={styles.summaryCard}>
          <Text style={styles.summaryLabel} accessibilityRole="header">
            今週の感情まとめ
          </Text>
          <Text
            style={[styles.summaryText, { color: Colors.emotion[dominantEmotion] }]}
            accessibilityLabel={`今週: ${EMOTION_SUMMARY[dominantEmotion]}`}
          >
            {EMOTION_SUMMARY[dominantEmotion]}
          </Text>
          <Pressable
            style={styles.insightLink}
            onPress={() => router.push('/insight')}
            accessibilityRole="button"
            accessibilityLabel="週次インサイトレポートを見る"
            accessibilityHint="感情分布グラフとAIコメントを含む詳細レポートを表示します"
          >
            <InsightSVG size={16} color={Colors.primaryLight} />
            <Text style={styles.insightLinkText}>週次インサイトを見る</Text>
          </Pressable>
        </GlassCard>

        {/* グラフ */}
        <GlassCard>
          <Text style={styles.graphTitle} accessibilityRole="header">
            感情の変化（直近{IS_PREMIUM ? '30日' : '7日'}）
          </Text>
          <EmotionGraph data={graphData} isPremium={IS_PREMIUM} />
        </GlassCard>

        {/* プレミアム誘導（無料プランのみ） */}
        {!IS_PREMIUM && (
          <GlassCard>
            <Text style={styles.premiumTitle}>
              過去の感情グラフをすべて見る
            </Text>
            <Text style={styles.premiumBody}>
              プレミアムプランでは月次・年次の感情変化を詳しく確認できます。
            </Text>
            <Pressable
              style={styles.premiumButton}
              onPress={() => router.push('/paywall')}
              accessibilityRole="button"
              accessibilityLabel="プレミアムプランで感情グラフを全期間表示する"
            >
              <Text style={styles.premiumButtonText}>
                プレミアムで全履歴を確認
              </Text>
            </Pressable>
          </GlassCard>
        )}

        {/* 感情別集計 */}
        <GlassCard>
          <Text style={styles.graphTitle} accessibilityRole="header">
            感情の内訳
          </Text>
          {(Object.keys(Colors.emotion) as EmotionType[]).map((emotion) => {
            const count = graphData.filter((d) => d.emotion === emotion).length;
            const total = graphData.length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const LABELS: Record<EmotionType, string> = {
              happy: 'うれしい',
              calm: 'おだやか',
              anxious: 'ふあん',
              sad: 'かなしい',
              angry: 'いかり',
            };
            return (
              <View
                key={emotion}
                style={styles.emotionRow}
                accessibilityLabel={`${LABELS[emotion]}: ${pct}%`}
              >
                <View style={[styles.emotionDot, { backgroundColor: Colors.emotion[emotion] }]} accessible={false} />
                <Text style={styles.emotionLabel}>{LABELS[emotion]}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct}%`, backgroundColor: Colors.emotion[emotion] },
                    ]}
                    accessible={false}
                  />
                </View>
                <Text style={styles.pctText}>{pct}%</Text>
              </View>
            );
          })}
        </GlassCard>
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
    paddingVertical: 16,
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
  insightLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  insightLinkText: {
    color: Colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  graphTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  premiumTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  premiumBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 44,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  emotionLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    width: 52,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  pctText: {
    color: Colors.textMuted,
    fontSize: 12,
    width: 32,
    textAlign: 'right',
  },
});
