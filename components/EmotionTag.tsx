import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, type EmotionType } from '../constants/colors';

const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: 'うれしい',
  sad: 'かなしい',
  angry: 'いかり',
  anxious: 'ふあん',
  calm: 'おだやか',
};

type Props = {
  emotion: EmotionType;
  size?: 'sm' | 'md';
};

export default function EmotionTag({ emotion, size = 'md' }: Props) {
  const color = Colors.emotion[emotion];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: `${color}22`,
          borderColor: `${color}55`,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
      accessibilityLabel={`感情: ${EMOTION_LABELS[emotion]}`}
    >
      <View style={[styles.dot, { backgroundColor: color, width: isSmall ? 6 : 8, height: isSmall ? 6 : 8 }]} accessible={false} />
      <Text style={[styles.label, { color, fontSize: isSmall ? 11 : 13 }]}>
        {EMOTION_LABELS[emotion]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    borderRadius: 10,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
