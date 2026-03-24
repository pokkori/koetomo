import React from 'react';
import Svg, { Polygon, Line } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function SoundOffSVG({ size = 22, color = '#9B8BB4' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
        fill={color}
      />
      <Line
        x1="23"
        y1="9"
        x2="17"
        y2="15"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Line
        x1="17"
        y1="9"
        x2="23"
        y2="15"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}
