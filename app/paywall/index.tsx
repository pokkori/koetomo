import React, { useState } from 'react';
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
import GlassCard from '../../components/GlassCard';

type Plan = 'monthly' | 'yearly';

const BENEFITS = [
  '1日の録音時間が無制限',
  '全ての日記を無期限保存',
  '感情グラフ・月次レポート全表示',
  'AI相づちの質が向上（より深い共感）',
  '広告が非表示になる',
  '週次AIレポート自動生成',
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly');

  const handleSubscribe = () => {
    // RevenueCat接続後に実際の課金フローを実装
    Alert.alert(
      'サブスクリプションのご案内',
      `${selectedPlan === 'monthly' ? '月額580円' : '年額4,800円（31%オフ）'}のプランに登録します。\n\n` +
        '・Apple/Google アカウントで自動更新\n' +
        '・いつでもキャンセル可能\n' +
        '・App Store/Google Play の設定から解約できます\n\n' +
        '本番環境では RevenueCat を通じて決済が行われます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '購入する',
          onPress: () => {
            Alert.alert('準備中', 'RevenueCat接続後に有効になります。');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            コエトモ プレミアム
          </Text>
          <Text style={styles.subtitle}>
            話し続けた記録をすべて残す
          </Text>
        </View>

        {/* プラン選択 */}
        <View style={styles.planSelector} accessibilityRole="radiogroup">
          <Pressable
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedPlan === 'monthly' }}
            accessibilityLabel="月額プラン 580円"
          >
            <Text style={styles.planOptionTitle}>月額プラン</Text>
            <Text style={styles.planOptionPrice}>
              <Text style={styles.planPriceMain}>580</Text>
              <Text style={styles.planPriceUnit}>円/月</Text>
            </Text>
            <Text style={styles.planOptionNote}>日記帳1冊より安い</Text>
          </Pressable>

          <Pressable
            style={[
              styles.planOption,
              selectedPlan === 'yearly' && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedPlan === 'yearly' }}
            accessibilityLabel="年額プラン 4800円 31パーセントオフ"
          >
            <View style={styles.discountBadge} accessible={false}>
              <Text style={styles.discountText}>31% オフ</Text>
            </View>
            <Text style={styles.planOptionTitle}>年額プラン</Text>
            <Text style={styles.planOptionPrice}>
              <Text style={styles.planPriceMain}>4,800</Text>
              <Text style={styles.planPriceUnit}>円/年</Text>
            </Text>
            <Text style={styles.planOptionNote}>1日あたり約13円</Text>
          </Pressable>
        </View>

        {/* 特典一覧 */}
        <GlassCard>
          <Text style={styles.benefitsTitle} accessibilityRole="header">
            プレミアムで解放される機能
          </Text>
          {BENEFITS.map((benefit, i) => (
            <View key={i} style={styles.benefitRow} accessibilityLabel={benefit}>
              <View style={styles.checkMark} accessible={false}>
                <Text style={styles.checkMarkText}>OK</Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </GlassCard>

        {/* 自動更新の説明（法的必須） */}
        <View style={styles.legalNote}>
          <Text style={styles.legalText}>
            購入すると{selectedPlan === 'monthly' ? '月次' : '年次'}で自動更新されます。
            更新の24時間前までにキャンセルしない限り自動的に課金されます。
            App Store / Google Play の設定からいつでも解約できます。
          </Text>
        </View>

        {/* 購入ボタン */}
        <Pressable
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          accessibilityRole="button"
          accessibilityLabel={
            selectedPlan === 'monthly'
              ? '月額580円でプレミアムプランを始める'
              : '年額4800円でプレミアムプランを始める'
          }
        >
          <Text style={styles.subscribeButtonText}>
            {selectedPlan === 'monthly' ? '月額580円で始める' : '年額4,800円で始める'}
          </Text>
        </Pressable>

        {/* リストア */}
        <Pressable
          style={styles.restoreButton}
          onPress={() => Alert.alert('購入の復元', 'RevenueCat接続後に有効になります。')}
          accessibilityRole="button"
          accessibilityLabel="以前の購入を復元する"
        >
          <Text style={styles.restoreText}>以前の購入を復元する</Text>
        </Pressable>

        {/* 閉じるボタン */}
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="このモーダルを閉じる"
        >
          <Text style={styles.closeText}>後で</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  planSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  planOption: {
    flex: 1,
    backgroundColor: Colors.glassCard,
    borderWidth: 2,
    borderColor: Colors.glassCardBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  planOptionSelected: {
    borderColor: Colors.primaryLight,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FBBF24',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  planOptionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  planOptionPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  planPriceMain: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  planPriceUnit: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  planOptionNote: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  benefitsTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  checkMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkMarkText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  benefitText: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  legalNote: {
    paddingHorizontal: 4,
  },
  legalText: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
  subscribeButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 44,
  },
  restoreText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 44,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});
