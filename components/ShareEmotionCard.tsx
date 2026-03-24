import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Colors, type EmotionType } from '../constants/colors';
import EmotionTag from './EmotionTag';

type Props = {
  emotion: EmotionType;
  diarySnippet: string;
  streakDays: number;
};

const SHARE_SVG_ICON = '→';  // SVGコンポーネントの代わりにシンプルなテキスト矢印

export default function ShareEmotionCard({ emotion, diarySnippet, streakDays }: Props) {
  const handleShare = async () => {
    const EMOTION_LABEL: Record<EmotionType, string> = {
      happy: 'うれしい',
      sad: 'かなしい',
      angry: 'いかり',
      anxious: 'ふあん',
      calm: 'おだやか',
    };

    const shareText =
      `今日の気持ち: ${EMOTION_LABEL[emotion]}\n\n` +
      `${diarySnippet.slice(0, 80)}...\n\n` +
      (streakDays > 0 ? `${streakDays}日連続で声日記を続けています。\n\n` : '') +
      `#コエトモ #声日記 #AIコンパニオン`;

    try {
      const result = await Share.share({
        message: shareText,
        title: '今日の声日記',
      });
      if (result.action === Share.sharedAction) {
        // シェア完了
      }
    } catch (e) {
      Alert.alert('シェアできませんでした', '後でもう一度お試しください。');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleShare}
      accessibilityRole="button"
      accessibilityLabel="今日の感情をシェアする"
      accessibilityHint="タップするとシェアシートが開きます"
    >
      <View style={styles.preview}>
        <EmotionTag emotion={emotion} size="sm" />
        <Text style={styles.snippet} numberOfLines={1}>
          {diarySnippet.slice(0, 30)}...
        </Text>
      </View>
      <View style={styles.shareButton}>
        <Text style={styles.shareButtonText}>シェア {SHARE_SVG_ICON}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  snippet: {
    color: Colors.textMuted,
    fontSize: 12,
    flex: 1,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    minHeight: 34,
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
