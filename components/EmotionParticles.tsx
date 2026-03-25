import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PARTICLE_COUNT = 10;

// 感情カラーに応じたパーティクル形状（ハートor星 SVGパス不要 → 円で表現）
type ParticleConfig = {
  angle: number; // ラジアン
  distance: number;
  delay: number;
  size: number;
  opacity: number;
};

function generateParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    return {
      angle,
      distance: 40 + Math.random() * 40,
      delay: i * 30,
      size: 5 + Math.random() * 6,
      opacity: 0.7 + Math.random() * 0.3,
    };
  });
}

type SingleParticleProps = {
  config: ParticleConfig;
  color: string;
  onLastFinish?: () => void;
  isLast: boolean;
};

function SingleParticle({ config, color, onLastFinish, isLast }: SingleParticleProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const finish = isLast ? onLastFinish : undefined;
    progress.value = withDelay(
      config.delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }, (done) => {
        if (done && finish) {
          runOnJS(finish)();
        }
      })
    );
  }, []);

  const tx = Math.cos(config.angle) * config.distance;
  const ty = Math.sin(config.angle) * config.distance;

  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: tx * p },
        { translateY: ty * p },
        { scale: 1 - p * 0.4 },
      ],
      opacity: config.opacity * (1 - p),
    };
  });

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color,
        },
      ]}
      accessible={false}
      pointerEvents="none"
    />
  );
}

type Props = {
  emotionColor: string;
  onFinish: () => void;
};

export default function EmotionParticles({ emotionColor, onFinish }: Props) {
  const particles = React.useMemo(() => generateParticles(), []);

  return (
    <View
      style={styles.overlay}
      pointerEvents="none"
      accessible={false}
    >
      {particles.map((config, i) => (
        <SingleParticle
          key={i}
          config={config}
          color={emotionColor}
          isLast={i === PARTICLE_COUNT - 1}
          onLastFinish={onFinish}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});
