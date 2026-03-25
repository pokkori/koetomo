import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { EMOTIONS } from '../constants/emotions';
import { Colors } from '../constants/colors';

type Props = {
  stats: Record<string, number>; // emotionId -> count
};

const BAR_MAX_HEIGHT = 80;

type AnimatedBarProps = {
  barHeight: number;
  color: string;
  count: number;
  index: number;
  opacity: number;
};

function AnimatedBar({ barHeight, color, count, index, opacity }: AnimatedBarProps) {
  const heightAnim = useSharedValue(0);

  useEffect(() => {
    heightAnim.value = withDelay(
      index * 100,
      withTiming(barHeight, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [barHeight, index]);

  const animStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    opacity: count > 0 ? 1 : 0,
  }));

  return (
    <Animated.View
      style={[
        styles.barFill,
        animStyle,
        { backgroundColor: color, opacity },
      ]}
      accessible={false}
    />
  );
}

export default function WeeklyBarChart({ stats }: Props) {
  const total = Object.values(stats).reduce((sum, n) => sum + n, 0);

  if (total === 0) {
    return (
      <View style={styles.empty} accessibilityLabel="今週の記録がありません">
        <Text style={styles.emptyText}>今週はまだ記録がありません</Text>
        <Text style={styles.emptySubText}>ホームから感情を記録してみましょう</Text>
      </View>
    );
  }

  const maxCount = Math.max(...Object.values(stats), 1);

  return (
    <View
      style={styles.container}
      accessibilityLabel="今週の感情分布棒グラフ"
    >
      {EMOTIONS.map((emotion, index) => {
        const count = stats[emotion.id] ?? 0;
        const barHeight = count > 0 ? Math.max((count / maxCount) * BAR_MAX_HEIGHT, 4) : 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <View
            key={emotion.id}
            style={styles.barGroup}
            accessibilityLabel={`${emotion.label}: ${count}回 (${pct}%)`}
          >
            <Text style={styles.countLabel}>{count > 0 ? count : ''}</Text>
            <View style={styles.barTrack}>
              <AnimatedBar
                barHeight={barHeight}
                color={emotion.color}
                count={count}
                index={index}
                opacity={count > 0 ? 1 : 0}
              />
            </View>
            <Text style={[styles.emotionLabel, { color: emotion.color }]}>
              {emotion.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  barTrack: {
    width: '70%',
    height: BAR_MAX_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  countLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    height: 16,
  },
  emotionLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
