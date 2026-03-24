import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="プライバシーポリシー"
      >
        <Text style={styles.pageTitle} accessibilityRole="header">
          プライバシーポリシー
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
    title: '1. 収集する情報',
    body:
      'コエトモは以下の情報を収集します。\n\n' +
      '・音声データ（録音）: マイクで録音した音声は、OpenAI Whisper APIによる文字起こし処理のためにのみ送信されます。音声データはサーバーに保存されません。文字起こし完了後、即時削除されます。\n\n' +
      '・テキストデータ（日記）: 文字起こし結果およびAI生成の日記テキストは、Supabaseデータベースに保存されます（無料プラン: 7日間 / プレミアム: 無期限）。\n\n' +
      '・感情データ: 感情スコアおよびタグはSupabaseに保存されます。\n\n' +
      '・デバイス識別子: プッシュ通知の配信のためExpo Push Tokenを使用します。',
  },
  {
    title: '2. 音声データの取り扱い',
    body:
      '音声データはプライバシーを最優先に取り扱います。\n\n' +
      '・録音データはOpenAI社のWhisper APIに送信し、テキストへの変換のみに使用します。\n' +
      '・音声ファイルは弊社サーバーには保存しません。\n' +
      '・無料プランでは音声ファイルはデバイスにも保存されません。\n' +
      '・プレミアムプランでは、音声ファイルをSupabase Storageに保存するオプションがあります（ユーザーの明示的な操作が必要）。',
  },
  {
    title: '3. 第三者サービスへの提供',
    body:
      '以下の第三者サービスを利用します。\n\n' +
      '・OpenAI（Whisper API）: 音声テキスト変換\n' +
      '・Anthropic（Claude API）: AI相づちおよび日記整理・感情分析\n' +
      '・Supabase: データベースおよびユーザー認証\n' +
      '・Google AdMob: 広告表示（無料プランのみ）\n' +
      '・RevenueCat: サブスクリプション管理\n' +
      '・Expo Push Notifications: プッシュ通知\n\n' +
      '各サービスのプライバシーポリシーについては、各社のウェブサイトをご確認ください。',
  },
  {
    title: '4. 医療情報に関する注意',
    body:
      'コエトモはメンタルヘルスケアのためのツールではありません。AIが生成するコメントは医療アドバイスを含みません。精神的なお悩みがある場合は、医療機関または専門家にご相談ください。',
  },
  {
    title: '5. データの保管期間',
    body:
      '無料プラン: 日記データは7日間保存後に自動削除されます。\nプレミアムプラン: 退会するまで無期限に保存されます。\nアカウント削除時: すべてのデータを即時削除します。',
  },
  {
    title: '6. お問い合わせ',
    body:
      'プライバシーに関するご質問は以下までご連絡ください。\n\nメール: support@koetomo.app',
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
