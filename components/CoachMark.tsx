import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Colors } from '../constants/colors';
import MicSVG from './svg/MicSVG';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

/**
 * 初回起動時のコーチマーク
 * 「ここを押して話しかけてね」を表示する
 */
export default function CoachMark({ visible, onDismiss }: Props) {
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [visible, arrowAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onDismiss}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="コーチマークを閉じる"
        accessibilityHint="タップすると案内が消えます"
      >
        <View style={styles.content}>
          <View style={styles.bubble}>
            <MicSVG size={20} color={Colors.primaryLight} />
            <Text style={styles.text}>ここを押して{'\n'}話しかけてね</Text>
          </View>

          <Animated.View style={{ transform: [{ translateY: arrowAnim }] }}>
            <View style={styles.arrow} accessible={false} />
          </Animated.View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="案内をスキップする"
          >
            <Text style={styles.skipText}>スキップ</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 8,
    marginTop: 120,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
