import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { supabase, type DiaryEntry } from '../../lib/supabase';
import EmotionTag from '../../components/EmotionTag';
import GlassCard from '../../components/GlassCard';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function DiaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setEntry(data as DiaryEntry);
        }
      } catch {
        // 取得失敗は無視
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.notFound}>日記が見つかりませんでした</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dateLabel = format(new Date(entry.created_at), 'yyyy年M月d日(E)', {
    locale: ja,
  });
  const durationMin = Math.floor(entry.recording_duration / 60);
  const durationSec = entry.recording_duration % 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 日付 */}
        <Text style={styles.date} accessibilityRole="header">
          {dateLabel}
        </Text>

        {/* 感情タグ + 録音時間 */}
        <View style={styles.metaRow}>
          <EmotionTag emotion={entry.emotion_primary} />
          <Text style={styles.duration} accessibilityElementsHidden>
            {durationMin > 0 ? `${durationMin}分` : ''}{durationSec}秒の録音
          </Text>
        </View>

        {/* AI相づち */}
        {entry.ai_backchat && (
          <GlassCard variant="elevated">
            <Text style={styles.backchatLabel}>コエトモのひとこと</Text>
            <Text
              style={styles.backchatText}
              accessibilityLabel={`コエトモ: ${entry.ai_backchat}`}
            >
              {entry.ai_backchat}
            </Text>
          </GlassCard>
        )}

        {/* AI日記 */}
        <GlassCard>
          <Text style={styles.sectionLabel} accessibilityRole="header">
            今日の日記
          </Text>
          <Text style={styles.diaryText}>{entry.ai_diary}</Text>
        </GlassCard>

        {/* 感情スコア */}
        {entry.emotion_score !== null && (
          <GlassCard>
            <Text style={styles.sectionLabel}>感情の強さ</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreFill,
                  {
                    width: `${(entry.emotion_score ?? 0) * 100}%`,
                    backgroundColor: Colors.emotion[entry.emotion_primary],
                  },
                ]}
                accessible={false}
              />
            </View>
            <Text
              style={styles.scoreText}
              accessibilityLabel={`感情スコア: ${Math.round((entry.emotion_score ?? 0) * 100)}%`}
            >
              {Math.round((entry.emotion_score ?? 0) * 100)}%
            </Text>
          </GlassCard>
        )}

        {/* タグ */}
        {(entry.emotion_tags ?? []).length > 0 && (
          <View style={styles.tagsRow} accessibilityLabel="感情タグ一覧">
            {(entry.emotion_tags ?? []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 文字起こし */}
        <GlassCard>
          <Text style={styles.sectionLabel} accessibilityRole="header">
            あなたの言葉（原文）
          </Text>
          <Text style={styles.transcriptionText}>{entry.transcription}</Text>
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
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  date: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  backchatLabel: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  backchatText: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 26,
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
  scoreBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
});
