import React from 'react';
import Svg, { Path, Rect, Line } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

/** 棒グラフ型アイコン（インサイト画面用） */
export default function InsightSVG({ size = 24, color = '#8B5CF6' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.8" />
      <Rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.8" />
      <Rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.8" />
      <Line x1="2" y1="21.5" x2="22" y2="21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
