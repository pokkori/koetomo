/**
 * コエトモ 背景: 癒し系夜空メッシュ
 * 癒しパレット: #0D1B2A -> #1B2838 / #7B68EE / #2DD4BF
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect, Defs, RadialGradient, Stop, LinearGradient, Circle,
} from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

export const GameBackground: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="baseBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E1B2E" />
            <Stop offset="40%" stopColor="#2D2550" />
            <Stop offset="100%" stopColor="#1A1535" />
          </LinearGradient>
          <RadialGradient id="purpleGlow" cx="30%" cy="25%" r="45%">
            <Stop offset="0%" stopColor="#7B68EE" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="tealGlow" cx="70%" cy="70%" r="40%">
            <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="pinkGlow" cx="50%" cy="50%" r="30%">
            <Stop offset="0%" stopColor="#CE93D8" stopOpacity="0.06" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={W} height={H} fill="url(#baseBg)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#purpleGlow)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#tealGlow)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#pinkGlow)" />

        {/* Soft star field */}
        {[
          [0.1, 0.08, 1.5], [0.25, 0.15, 1], [0.4, 0.05, 2], [0.6, 0.12, 1.5],
          [0.8, 0.08, 1], [0.9, 0.2, 1.5], [0.15, 0.35, 1], [0.5, 0.3, 1],
          [0.75, 0.4, 1.5], [0.3, 0.55, 1], [0.65, 0.5, 1],
        ].map(([x, y, r], i) => (
          <Circle
            key={i}
            cx={W * x}
            cy={H * y}
            r={r}
            fill="#FFFFFF"
            opacity={0.15 + (i % 3) * 0.08}
          />
        ))}
      </Svg>
    </View>
  );
};
