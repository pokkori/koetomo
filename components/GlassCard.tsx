import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
};

export default function GlassCard({ children, style, variant = 'default' }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    borderRadius: 20,
    padding: 16,
  },
  elevated: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(167, 139, 250, 0.25)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
});
