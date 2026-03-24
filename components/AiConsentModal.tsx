import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

const CONSENT_KEY = '@koetomo/ai_consent_given';

export async function hasAiConsentAsync(): Promise<boolean> {
  const val = await AsyncStorage.getItem(CONSENT_KEY);
  return val === 'true';
}

export async function setAiConsentAsync(): Promise<void> {
  await AsyncStorage.setItem(CONSENT_KEY, 'true');
}

type Props = {
  visible: boolean;
  onConsent: () => void;
};

/**
 * App Store Guideline 5.1.2(i) 対応
 * AIプロバイダー名と音声データの送信について初回同意を取得する
 */
export default function AiConsentModal({ visible, onConsent }: Props) {
  const handleAccept = async () => {
    await setAiConsentAsync();
    onConsent();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title} accessibilityRole="header">
              AIサービスの利用について
            </Text>

            <Text style={styles.body}>
              コエトモは以下の外部AIサービスを使用します。
            </Text>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>OpenAI（Whisper API）</Text>
              <Text style={styles.serviceDesc}>
                録音した音声をテキストに変換するために使用します。音声データは変換後に即時削除され、弊社サーバーには保存されません。
              </Text>
            </View>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>Anthropic（Claude API）</Text>
              <Text style={styles.serviceDesc}>
                文字起こしテキストから日記の整理・感情分析・AI相づちを生成するために使用します。会話内容はAnthropicのサーバーに送信されます。
              </Text>
            </View>

            <Text style={styles.note}>
              各サービスのプライバシーポリシーはプロフィール画面からご確認いただけます。医療診断・心理カウンセリングの代替ではありません。
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            accessibilityRole="button"
            accessibilityLabel="AI利用に同意してコエトモを始める"
          >
            <Text style={styles.acceptButtonText}>同意して始める</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#252238',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 24,
    maxHeight: '80%',
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  serviceCard: {
    backgroundColor: Colors.glassCard,
    borderWidth: 1,
    borderColor: Colors.glassCardBorder,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  serviceName: {
    color: Colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
  },
  serviceDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  note: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  acceptButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
