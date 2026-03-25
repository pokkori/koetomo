import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { EMOTIONS, type EmotionCategory } from '../constants/emotions';
import { Colors } from '../constants/colors';
import GlassCard from './GlassCard';

type Props = {
  todayEmotion: EmotionCategory | null; // 今日の記録済み感情（未記録ならnull）
  onSelect: (emotion: EmotionCategory) => void;
};

export default function TodayEmotionCard({ todayEmotion, onSelect }: Props) {
  const handleSelect = useCallback(
    async (emotion: EmotionCategory) => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ハプティクス失敗はサイレント
      }
      onSelect(emotion);
    },
    [onSelect]
  );

  if (todayEmotion) {
    // 記録済み: 今日の気持ちを表示
    return (
      <GlassCard
        variant="elevated"
        style={styles.recordedCard}
        // accessibilityLabel は View に渡せないが親のGlassCardがViewのため別途定義
      >
        <View
          accessibilityLabel={`今日の気持ち: ${todayEmotion.label}。変更するには感情ボタンをタップしてください`}
          accessible
        >
          <Text style={styles.recordedTitle}>今日の気持ち</Text>
          <View style={styles.recordedRow}>
            <Svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill={todayEmotion.color}
              accessible={false}
            >
              <Path d={todayEmotion.svgPath} />
            </Svg>
            <Text style={[styles.recordedEmotion, { color: todayEmotion.color }]}>
              {todayEmotion.label}
            </Text>
          </View>
          <Text style={styles.recordedSubtext}>変更することもできます</Text>
        </View>

        {/* 変更用ピッカー（横スクロール） */}
        <View style={styles.pickerRow} accessible={false}>
          {EMOTIONS.map((emotion) => {
            const selected = emotion.id === todayEmotion.id;
            return (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.miniChip,
                  selected && { borderColor: emotion.color, backgroundColor: `${emotion.color}25` },
                ]}
                onPress={() => handleSelect(emotion)}
                accessibilityRole="button"
                accessibilityLabel={`${emotion.label}に変更`}
                accessibilityState={{ selected }}
              >
                <Svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill={emotion.color}
                  accessible={false}
                >
                  <Path d={emotion.svgPath} />
                </Svg>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassCard>
    );
  }

  // 未記録: 感情タップCTA
  return (
    <GlassCard style={styles.ctaCard}>
      <Text style={styles.ctaTitle} accessibilityRole="header">
        今日の感情を記録
      </Text>
      <Text style={styles.ctaSubtext}>
        今の気持ちを選ぶだけで記録できます
      </Text>
      <View
        style={styles.emotionGrid}
        accessibilityLabel="感情カテゴリ一覧。タップして今日の気持ちを記録してください"
      >
        {EMOTIONS.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={styles.emotionChip}
            onPress={() => handleSelect(emotion)}
            accessibilityRole="button"
            accessibilityLabel={`${emotion.label}を記録する`}
            accessibilityHint={`今日の感情を${emotion.label}として保存します`}
          >
            <Svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill={emotion.color}
              accessible={false}
            >
              <Path d={emotion.svgPath} />
            </Svg>
            <Text style={[styles.emotionChipLabel, { color: emotion.color }]}>
              {emotion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  ctaCard: {
    gap: 12,
  },
  ctaTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSubtext: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: -4,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    minHeight: 44,
  },
  emotionChipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  recordedCard: {
    gap: 12,
  },
  recordedTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  recordedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordedEmotion: {
    fontSize: 22,
    fontWeight: '700',
  },
  recordedSubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  miniChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
