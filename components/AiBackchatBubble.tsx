import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '../constants/colors';

type Props = {
  text: string;
  isStreaming?: boolean;
};

/**
 * AI相づちを Streaming 風にタイプライター表示するバブルコンポーネント
 */
export default function AiBackchatBubble({ text, isStreaming = false }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const opacity = useSharedValue(0);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!text) return;

    // フェードイン
    opacity.value = withTiming(1, { duration: 300 });

    // タイプライター演出
    indexRef.current = 0;
    setDisplayedText('');

    const typeNext = () => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayedText(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(typeNext, 35);
      }
    };
    typeNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, opacity]);

  if (!text && !isStreaming) return null;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={styles.bubble}>
        <View style={styles.avatarDot} accessible={false} />
        <Text
          style={styles.text}
          accessibilityLabel={`コエトモ: ${displayedText}`}
        >
          {displayedText}
          {isStreaming && displayedText.length < text.length && (
            <Text style={styles.cursor}>|</Text>
          )}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.aiBubble,
    borderWidth: 1,
    borderColor: Colors.aiBubbleBorder,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    maxWidth: '85%',
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
    marginTop: 5,
    flexShrink: 0,
  },
  text: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    flexWrap: 'wrap',
  },
  cursor: {
    color: Colors.primaryLight,
    fontWeight: 'bold',
  },
});
