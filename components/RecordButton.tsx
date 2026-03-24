import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
} from 'react-native';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [state, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';

  const buttonColor = isProcessing
    ? Colors.textMuted
    : isRecording
    ? Colors.recordButtonActive
    : Colors.recordButtonIdle;

  return (
    <View style={styles.container}>
      {/* 外側の光彩リング（録音中のみ表示） */}
      {isRecording && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: isNearLimit ? '#FBBF24' : Colors.recordButtonActive,
            },
          ]}
          accessible={false}
        />
      )}

      <Animated.View
        style={{ transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] }}
      >
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
