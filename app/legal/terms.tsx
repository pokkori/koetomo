import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="利用規約"
      >
        <Text style={styles.pageTitle} accessibilityRole="header">
          利用規約
        </Text>
        <Text style={styles.updated}>最終更新日: 2026年3月24日</Text>

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
  );
}

const SECTIONS = [
  {
    title: '第1条（適用）',
    body:
      '本規約は、「コエトモ」（以下「本サービス」）の利用に関して、提供者とユーザーとの間の権利義務関係を定めます。',
  },
  {
    title: '第2条（利用登録）',
    body:
      '本サービスは会員登録なしで基本機能をご利用いただけます。一部機能はプレミアムプランへの加入が必要です。',
  },
  {
    title: '第3条（禁止事項）',
    body:
      '以下の行為を禁止します。\n\n' +
      '・第三者への権利侵害\n' +
      '・違法または公序良俗に反するコンテンツの生成\n' +
      '・サービスへの不正アクセス\n' +
      '・他のユーザーの迷惑となる行為\n' +
      '・商業目的での無断利用\n' +
      '・AI生成コンテンツを医療診断・法律相談として利用すること',
  },
  {
    title: '第4条（医療免責）',
    body:
      '本サービスが提供するAIコメント・感情分析は医療診断・精神科的評価・心理カウンセリングの代替ではありません。精神的なお悩みがある場合は必ず医療機関にご相談ください。',
  },
  {
    title: '第5条（サービスの変更・停止）',
    body:
      '提供者は事前通知なくサービスの内容を変更・停止する場合があります。これによるユーザーへの損害について、提供者は責任を負いません。',
  },
  {
    title: '第6条（免責事項）',
    body:
      '本サービスは現状のまま提供され、特定目的への適合性を保証しません。通信障害・APIサービス障害による損害について提供者は責任を負いません。',
  },
  {
    title: '第7条（準拠法・裁判管轄）',
    body: '本規約は日本法に準拠し、東京地方裁判所を第一審の専属的合意管轄とします。',
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
    marginBottom: 4,
  },
  updated: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 24,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassCardBorder,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: Colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
