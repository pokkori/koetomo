import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { EMOTIONS, type EmotionCategory } from '../constants/emotions';
import { Colors } from '../constants/colors';

type Props = {
  selectedId: string | null;
  onSelect: (emotion: EmotionCategory) => void;
};

export default function EmotionQuickPicker({ selectedId, onSelect }: Props) {
  return (
    <View style={styles.wrapper} accessibilityLabel="感情を選択してください">
      <Text style={styles.label} accessibilityRole="header">
        今の気持ちは？
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="感情カテゴリ一覧"
      >
        {EMOTIONS.map((emotion) => {
          const selected = selectedId === emotion.id;
          return (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.chip,
                selected && { backgroundColor: `${emotion.color}30`, borderColor: emotion.color },
              ]}
              onPress={() => onSelect(emotion)}
              accessibilityRole="button"
              accessibilityLabel={`${emotion.label}を選択`}
              accessibilityState={{ selected }}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill={emotion.color}
                accessible={false}
              >
                <Path d={emotion.svgPath} />
              </Svg>
              <Text style={[styles.chipLabel, { color: selected ? emotion.color : Colors.textSecondary }]}>
                {emotion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    minHeight: 44,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
