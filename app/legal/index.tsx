import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

export default function LegalScreen() {
  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="特定商取引法に基づく表記"
      >
        <Text style={styles.pageTitle} accessibilityRole="header">
          特定商取引法に基づく表記
        </Text>

        {SECTIONS.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {section.title}
            </Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const SECTIONS = [
  { title: '販売業者名', body: '個人運営' },
  { title: '所在地', body: '請求があった場合は遅滞なく開示します' },
  { title: '電話番号', body: '090-6093-5290' },
  { title: 'メールアドレス', body: 'support@koetomo.app' },
  { title: 'サービス名', body: 'コエトモ - 声日記AIコンパニオン' },
  {
    title: '販売価格',
    body:
      '無料プラン: 無料\nプレミアム月額プラン: 580円（税込）/月\nプレミアム年額プラン: 4,800円（税込）/年\n\n価格はApp Store / Google Play の表示に従います。',
  },
  {
    title: '代金の支払方法',
    body:
      'App Store（Apple ID 残高 / クレジットカード）\nGoogle Play（Google アカウントの支払方法）',
  },
  {
    title: 'サービス提供時期',
    body: '購入・決済完了後、直ちにサービスを利用いただけます。',
  },
  {
    title: 'サブスクリプションの自動更新',
    body:
      'プレミアムプランは選択した周期（月次または年次）で自動更新されます。\n更新の24時間前までにApp Store / Google Playの設定でキャンセルすることで、次回の課金を停止できます。',
  },
  {
    title: 'キャンセル・返金ポリシー',
    body:
      'デジタルコンテンツの性質上、購入後の返金は原則として承っておりません。\n\nただし、App Store / Google Playの返金ポリシーに従い対応いたします。\n・iOS: Apple サポートよりご申請ください\n・Android: Google Play サポートよりご申請ください\n\nサブスクリプションのキャンセルはいつでも可能です。キャンセル後も当該期間終了まではサービスをご利用いただけます。',
  },
  {
    title: '動作環境',
    body:
      'iOS 16.0以上、または Android 9.0以上\nインターネット接続環境（音声変換・AI機能に必要）',
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
    paddingVertical: 24,
    gap: 0,
  },
  pageTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassCardBorder,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
