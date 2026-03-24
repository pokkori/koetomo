import React from 'react';
import Svg, { Path, Rect, Line } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function MicSVG({ size = 24, color = '#FFFFFF' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <Path
        d="M5 10a7 7 0 0 0 14 0"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <Line
        x1="12"
        y1="17"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Line
        x1="9"
        y1="21"
        x2="15"
        y2="21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}
