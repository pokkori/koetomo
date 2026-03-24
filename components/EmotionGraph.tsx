import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, type EmotionType } from '../constants/colors';

type DataPoint = {
  date: string; // YYYY-MM-DD
  emotion: EmotionType;
  score: number; // 0.0 ~ 1.0
};

type Props = {
  data: DataPoint[];
  isPremium: boolean;
  /** 無料プランでは7日分のみ表示し以前はぼかす */
};

const EMOTION_Y: Record<EmotionType, number> = {
  happy: 10,
  calm: 30,
  anxious: 50,
  sad: 70,
  angry: 90,
};

const EMOTION_LABEL: Record<EmotionType, string> = {
  happy: 'うれしい',
  calm: 'おだやか',
  anxious: 'ふあん',
  sad: 'かなしい',
  angry: 'いかり',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_WIDTH = SCREEN_WIDTH - 60;
const GRAPH_HEIGHT = 120;

export default function EmotionGraph({ data, isPremium }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>まだ記録がありません</Text>
        <Text style={styles.emptySubText}>録音すると感情グラフが表示されます</Text>
      </View>
    );
  }

  // 無料ユーザーは最新7日分のみ表示
  const FREE_LIMIT = 7;
  const visibleData = isPremium ? data : data.slice(-FREE_LIMIT);
  const hiddenCount = isPremium ? 0 : Math.max(0, data.length - FREE_LIMIT);

  const stepX = GRAPH_WIDTH / Math.max(visibleData.length - 1, 1);

  const points = visibleData.map((d, i) => ({
    x: i * stepX,
    y: EMOTION_Y[d.emotion] * (GRAPH_HEIGHT / 100),
    emotion: d.emotion,
    score: d.score,
    date: d.date,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container} accessibilityLabel="感情グラフ">
      {/* 横軸ラベル */}
      <View style={styles.yLabels} accessible={false}>
        {(Object.keys(EMOTION_Y) as EmotionType[]).map((em) => (
          <Text
            key={em}
            style={[styles.yLabel, { color: Colors.emotion[em] }]}
          >
            {EMOTION_LABEL[em]}
          </Text>
        ))}
      </View>

      {/* SVGグラフ本体 */}
      <View style={styles.graphArea}>
        {/* 過去データのぼかしカバー（無料ユーザー） */}
        {!isPremium && hiddenCount > 0 && (
          <View style={styles.blurOverlay}>
            <Text style={styles.blurText}>プレミアムで全履歴を表示</Text>
            <Text style={styles.blurSubText}>{hiddenCount}日分の記録があります</Text>
          </View>
        )}

        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
          {/* 横グリッド線 */}
          {(Object.values(EMOTION_Y) as number[]).map((y) => (
            <Line
              key={y}
              x1="0"
              y1={y * (GRAPH_HEIGHT / 100)}
              x2={GRAPH_WIDTH}
              y2={y * (GRAPH_HEIGHT / 100)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* 折れ線 */}
          {points.length > 1 && (
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke={Colors.primaryLight}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* データポイント */}
          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill={Colors.emotion[p.emotion]}
              stroke={Colors.background}
              strokeWidth="2"
            />
          ))}

          {/* 日付ラベル（最初・最後） */}
          {points.length > 0 && (
            <>
              <SvgText
                x="0"
                y={GRAPH_HEIGHT + 14}
                fill={Colors.textMuted}
                fontSize="10"
              >
                {formatShortDate(points[0].date)}
              </SvgText>
              {points.length > 1 && (
                <SvgText
                  x={points[points.length - 1].x - 16}
                  y={GRAPH_HEIGHT + 14}
                  fill={Colors.textMuted}
                  fontSize="10"
                >
                  {formatShortDate(points[points.length - 1].date)}
                </SvgText>
              )}
            </>
          )}
        </Svg>
      </View>
    </View>
  );
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 20,
  },
  yLabels: {
    justifyContent: 'space-between',
    paddingVertical: 4,
    width: 44,
    height: GRAPH_HEIGHT,
  },
  yLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'right',
  },
  graphArea: {
    flex: 1,
    position: 'relative',
  },
  blurOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '60%',
    height: GRAPH_HEIGHT,
    backgroundColor: 'rgba(30, 27, 46, 0.85)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 4,
  },
  blurText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  blurSubText: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
