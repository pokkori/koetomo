import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function ChevronRightSVG({ size = 20, color = '#C3A6FF' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="9 18 15 12 9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
