import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import EmotionTag from './EmotionTag';
import type { DiaryEntry } from '../lib/supabase';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import ChevronRightSVG from './svg/ChevronRightSVG';

type Props = {
  entry: DiaryEntry;
  onPress: () => void;
};

export default function DiaryCard({ entry, onPress }: Props) {
  const dateLabel = format(new Date(entry.created_at), 'M月d日(E)', { locale: ja });
  const preview = entry.ai_diary.slice(0, 60) + (entry.ai_diary.length > 60 ? '...' : '');
  const durationMin = Math.floor(entry.recording_duration / 60);
  const durationSec = entry.recording_duration % 60;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${dateLabel}の日記。${EMOTION_LABELS[entry.emotion_primary]}。${preview}`}
      accessibilityHint="タップして日記の詳細を見る"
    >
      <View style={styles.header}>
        <Text style={styles.date}>{dateLabel}</Text>
        <Text style={styles.duration} accessibilityElementsHidden>
          {durationMin > 0 ? `${durationMin}分${durationSec}秒` : `${durationSec}秒`}
        </Text>
      </View>

      <Text style={styles.preview} numberOfLines={2}>
        {preview}
      </Text>

      <View style={styles.footer}>
        <EmotionTag emotion={entry.emotion_primary} size="sm" />
        <View style={styles.tagsRow}>
          {(entry.emotion_tags ?? []).slice(0, 2).map((tag) => (
            <View key={tag} style={styles.miniTag}>
              <Text style={styles.miniTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <ChevronRightSVG size={16} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const EMOTION_LABELS: Record<string, string> = {
  happy: 'うれしい',
  sad: 'かなしい',
  angry: 'いかり',
  anxious: 'ふあん',
  calm: 'おだやか',
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  duration: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  preview: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  miniTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  miniTagText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
