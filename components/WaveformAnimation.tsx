import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

type Props = {
  isActive: boolean;
  barCount?: number;
};

function WaveBar({ isActive, index, maxScale, duration }: { isActive: boolean; index: number; maxScale: number; duration: number }) {
  const progress = useSharedValue(0.15);

  useEffect(() => {
    if (!isActive) {
      progress.value = withTiming(0.15, { duration: 300 });
      return;
    }

    progress.value = withDelay(
      index * 60,
      withRepeat(
        withSequence(
          withTiming(maxScale, { duration }),
          withTiming(0.15, { duration }),
        ),
        -1,
        false,
      ),
    );
  }, [isActive, index, maxScale, duration, progress]);

  const animStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [4, 44]),
    backgroundColor: isActive ? Colors.primaryLight : Colors.textMuted,
    opacity: isActive ? 1 : 0.4,
  }));

  return <Animated.View style={[styles.bar, animStyle]} />;
}

export default function WaveformAnimation({ isActive, barCount = 7 }: Props) {
  // Generate stable random values for each bar
  const barConfigs = React.useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        maxScale: 0.3 + ((i * 17 + 7) % 10) / 10 * 0.7,
        duration: 300 + ((i * 13 + 3) % 10) / 10 * 400,
      })),
    [barCount],
  );

  return (
    <View
      style={styles.container}
      accessible={false}
      aria-hidden
    >
      {barConfigs.map((config, i) => (
        <WaveBar
          key={i}
          isActive={isActive}
          index={i}
          maxScale={config.maxScale}
          duration={config.duration}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 48,
  },
  bar: {
    width: 5,
    borderRadius: 3,
  },
});
