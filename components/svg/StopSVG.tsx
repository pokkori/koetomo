import React from 'react';
import Svg, { Rect } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function StopSVG({ size = 24, color = '#FFFFFF' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="6" width="12" height="12" rx="2" fill={color} />
    </Svg>
  );
}
