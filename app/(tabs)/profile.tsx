import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { getStreakAsync } from '../../lib/streak';
import GlassCard from '../../components/GlassCard';
import StreakBadge from '../../components/StreakBadge';
import ChevronRightSVG from '../../components/svg/ChevronRightSVG';

// プレミアムフラグ（RevenueCat接続後に動的取得）
const IS_PREMIUM = false;

export default function ProfileScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getStreakAsync().then(setStreak);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* プランバッジ */}
        <GlassCard variant="elevated" style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName} accessibilityRole="header">
              {IS_PREMIUM ? 'プレミアムプラン' : '無料プラン'}
            </Text>
            {!IS_PREMIUM && (
              <Pressable
                style={styles.upgradeChip}
                onPress={() => router.push('/paywall')}
                accessibilityRole="button"
                accessibilityLabel="プレミアムプランにアップグレードする"
              >
                <Text style={styles.upgradeChipText}>アップグレード</Text>
              </Pressable>
            )}
          </View>
          {!IS_PREMIUM && (
            <Text style={styles.planLimits}>
              1日3分まで録音 / 日記7日間保存 / 基本感情グラフ
            </Text>
          )}
        </GlassCard>

        {/* ストリーク */}
        <GlassCard>
          <Text style={styles.sectionLabel} accessibilityRole="header">
            連続記録
          </Text>
          <View style={styles.streakRow}>
            <StreakBadge streak={streak} />
            {streak === 0 && (
              <Text style={styles.noStreak}>まだ記録を始めていません</Text>
            )}
          </View>
          {streak > 0 && (
            <Text style={styles.streakNote}>
              {streak}日間コエトモと話し続けています。素晴らしいです。
            </Text>
          )}
          {streak >= 7 && (
            <Text style={styles.milestone} accessibilityLabel="7日連続達成バッジ取得">
              コエトモのともだちバッジを獲得しました
            </Text>
          )}
        </GlassCard>

        {/* メニュー */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle} accessibilityRole="header">
            サポート・情報
          </Text>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => router.push(item.path as `/${string}`)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityHint={item.hint}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRightSVG />
            </Pressable>
          ))}
        </View>

        {/* アプリ情報 */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>コエトモ v1.0.0</Text>
          <Text style={styles.appInfoText}>
            声で話すだけでAIが日記に変えてくれる
          </Text>
        </View>

        {/* お問い合わせ */}
        <Pressable
          style={styles.supportButton}
          onPress={() => Alert.alert('お問い合わせ', 'support@koetomo.app までご連絡ください')}
          accessibilityRole="button"
          accessibilityLabel="サポートへお問い合わせ"
        >
          <Text style={styles.supportButtonText}>サポートへお問い合わせ</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const MENU_ITEMS = [
  {
    label: '特定商取引法に基づく表記',
    path: '/legal',
    hint: '特定商取引法の詳細ページを開きます',
  },
  {
    label: 'プライバシーポリシー',
    path: '/legal/privacy',
    hint: 'プライバシーポリシーページを開きます',
  },
  {
    label: '利用規約',
    path: '/legal/terms',
    hint: '利用規約ページを開きます',
  },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  planCard: {
    gap: 8,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  upgradeChip: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  upgradeChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  planLimits: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noStreak: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  streakNote: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  milestone: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  menuSection: {
    gap: 0,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
  },
  menuSectionTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: Colors.glassCardBorder,
  },
  menuLabel: {
    color: Colors.text,
    fontSize: 15,
  },
  appInfo: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  appInfoText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  supportButton: {
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 44,
  },
  supportButtonText: {
    color: Colors.primaryLight,
    fontSize: 14,
    fontWeight: '600',
  },
});
