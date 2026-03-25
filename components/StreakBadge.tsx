import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import HeartSVG from './svg/HeartSVG';

type Props = {
  streak: number;
};

export default function StreakBadge({ streak }: Props) {
  // ゆらゆら回転 (-5deg ↔ +5deg)
  const rotate = useSharedValue(0);
  // ストリーク更新時ポップ
  const popScale = useSharedValue(1);

  const prevStreak = React.useRef(streak);

  useEffect(() => {
    if (streak === 0) return;

    // 炎ゆらゆら: 繰り返し
    rotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false
    );

    // 値が増加した時: scale 1.0 → 1.3 → 1.0
    if (streak > prevStreak.current) {
      popScale.value = withSequence(
        withSpring(1.3, { damping: 6, stiffness: 350 }),
        withSpring(1.0, { damping: 14, stiffness: 300 }),
      );
    }
    prevStreak.current = streak;
  }, [streak]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: popScale.value },
    ],
  }));

  if (streak === 0) return null;

  const isMilestone = streak === 7 || streak === 30 || streak === 100;

  return (
    <Animated.View
      style={[
        styles.container,
        isMilestone && styles.milestone,
        badgeAnimStyle,
      ]}
      accessibilityLabel={`${streak}日連続で話しています`}
    >
      <Animated.View style={iconAnimStyle} accessible={false}>
        <HeartSVG size={14} color={isMilestone ? '#FBBF24' : Colors.primaryLight} />
      </Animated.View>
      <Text style={[styles.text, isMilestone && styles.milestoneText]}>
        {streak}日連続
      </Text>
      {isMilestone && (
        <Text style={styles.milestoneLabel} accessibilityElementsHidden>
          達成
        </Text>
      )}
    </Animated.View>
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
