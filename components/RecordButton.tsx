import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import type { RecordingState } from '../hooks/useRecording';
import MicSVG from './svg/MicSVG';
import StopSVG from './svg/StopSVG';

type Props = {
  state: RecordingState;
  onPress: () => void;
  remainingSeconds: number | null;
  isNearLimit: boolean;
};

export default function RecordButton({
  state,
  onPress,
  remainingSeconds,
  isNearLimit,
}: Props) {
  // タップ時 press scale
  const pressScale = useSharedValue(1);
  // 録音中のドキドキ pulse scale
  const pulseScale = useSharedValue(1);
  // 外側グローリング scale
  const ringScale = useSharedValue(1);
  // 録音完了時ポップ
  const completionScale = useSharedValue(1);

  const prevState = React.useRef<RecordingState>('idle');

  useEffect(() => {
    const prev = prevState.current;
    prevState.current = state;

    if (state === 'recording') {
      // 録音中: 1.0 ↔ 1.1 でドキドキ感 (withRepeat reversed)
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true
      );
      // グローリングも同期してゆっくり拡縮
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 700, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(ringScale);

      if (prev === 'recording') {
        // 録音完了: scale 1.2 → 1.0 ポップ感
        completionScale.value = withSequence(
          withSpring(1.2, { damping: 6, stiffness: 400 }),
          withSpring(1.0, { damping: 14, stiffness: 300 }),
        );
      }

      pulseScale.value = withTiming(1.0, { duration: 200 });
      ringScale.value = withTiming(1.0, { duration: 200 });
    }
  }, [state]);

  // pressIn: scale 0.85
  const handlePressIn = () => {
    pressScale.value = withSpring(0.85, { damping: 10, stiffness: 400 });
  };

  // pressOut: scale → 1.0
  const handlePressOut = () => {
    pressScale.value = withSpring(1.0, { damping: 12, stiffness: 350 });
  };

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pressScale.value * pulseScale.value * completionScale.value },
    ],
  }));

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';

  const buttonColor = isProcessing
    ? Colors.textMuted
    : isRecording
    ? Colors.recordButtonActive
    : Colors.recordButtonIdle;

  return (
    <View style={styles.container}>
      {/* 外側の光彩リング（録音中のみ） */}
      {isRecording && (
        <Animated.View
          style={[
            styles.glowRing,
            ringAnimStyle,
            {
              borderColor: isNearLimit ? '#FBBF24' : Colors.recordButtonActive,
            },
          ]}
          accessible={false}
          pointerEvents="none"
        />
      )}

      <Animated.View style={buttonAnimStyle}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel={
            isProcessing
              ? '処理中です。しばらくお待ちください'
              : isRecording
              ? '録音を停止する'
              : 'タップして録音を開始する'
          }
          accessibilityHint={
            isRecording
              ? 'タップすると録音が止まり、AIが日記を作成します'
              : 'タップするとマイクが起動し、話しかけられます'
          }
        >
          {isRecording ? (
            <StopSVG size={40} color="#FFFFFF" />
          ) : (
            <MicSVG size={44} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* ラベル */}
      <Text style={styles.label} accessibilityElementsHidden>
        {isProcessing
          ? '日記を作成中...'
          : isRecording
          ? '話し終わったらタップ'
          : '話しかける'}
      </Text>

      {/* 残り時間（無料プラン・録音中のみ） */}
      {isRecording && remainingSeconds !== null && (
        <Text
          style={[styles.timer, isNearLimit && styles.timerWarning]}
          accessibilityLabel={`残り録音時間 ${remainingSeconds} 秒`}
        >
          残り {remainingSeconds}秒
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    top: -10,
    left: -10,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.recordButtonActive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  timer: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  timerWarning: {
    color: '#FBBF24',
  },
});
