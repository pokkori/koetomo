import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import HeartSVG from './svg/HeartSVG';

type Props = {
  streak: number;
};

export default function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;

  const isMilestone = streak === 7 || streak === 30 || streak === 100;

  return (
    <View
      style={[styles.container, isMilestone && styles.milestone]}
      accessibilityLabel={`${streak}日連続で話しています`}
    >
      <HeartSVG size={14} color={isMilestone ? '#FBBF24' : Colors.primaryLight} />
      <Text style={[styles.text, isMilestone && styles.milestoneText]}>
        {streak}日連続
      </Text>
      {isMilestone && (
        <Text style={styles.milestoneLabel} accessibilityElementsHidden>
          達成
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  milestone: {
    borderColor: 'rgba(251, 191, 36, 0.4)',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  text: {
    color: Colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  milestoneText: {
    color: '#FBBF24',
  },
  milestoneLabel: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '600',
  },
});
