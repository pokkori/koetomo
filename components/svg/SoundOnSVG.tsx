import React from 'react';
import Svg, { Polygon, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function SoundOnSVG({ size = 22, color = '#C3A6FF' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
        fill={color}
      />
      <Path
        d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
