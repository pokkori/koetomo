import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  isActive: boolean;
  barCount?: number;
};

export default function WaveformAnimation({ isActive, barCount = 7 }: Props) {
  const animations = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.15))
  ).current;

  useEffect(() => {
    if (!isActive) {
      animations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    const loops = animations.map((anim, i) => {
      const maxScale = 0.3 + Math.random() * 0.7;
      const duration = 300 + Math.random() * 400;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: maxScale,
            duration: duration,
            delay: i * 60,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.15,
            duration: duration,
            useNativeDriver: false,
          }),
        ])
      );
    });

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [isActive, animations]);

  return (
    <View
      style={styles.container}
      accessible={false}
      aria-hidden
    >
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 44],
              }),
              backgroundColor: isActive ? Colors.primaryLight : Colors.textMuted,
              opacity: isActive ? 1 : 0.4,
            },
          ]}
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
