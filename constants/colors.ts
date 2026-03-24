export const Colors = {
  background: '#1E1B2E',
  backgroundGradientStart: '#0f0c29',
  backgroundGradientMid: '#302b63',
  backgroundGradientEnd: '#24243e',
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  text: '#F0EAF8',
  textSecondary: '#C3A6FF',
  textMuted: '#9B8BB4',
  card: 'rgba(139, 92, 246, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  glassCard: 'rgba(255, 255, 255, 0.08)',
  glassCardBorder: 'rgba(255, 255, 255, 0.15)',
  recordButtonIdle: '#7C5CBF',
  recordButtonActive: '#FF6B6B',
  aiBubble: 'rgba(139, 92, 246, 0.2)',
  aiBubbleBorder: 'rgba(167, 139, 250, 0.3)',

  emotion: {
    happy: '#FBBF24',
    sad: '#60A5FA',
    angry: '#EF4444',
    anxious: '#F97316',
    calm: '#10B981',
  },
} as const;

export type EmotionType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm';
