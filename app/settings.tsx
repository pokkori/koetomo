import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [bgmVolume, setBgmVolume] = useState(0.8);
  const [seVolume, setSeVolume] = useState(1.0);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@settings');
        if (raw) {
          const s = JSON.parse(raw);
          if (s.bgmVolume !== undefined) setBgmVolume(s.bgmVolume);
          if (s.seVolume !== undefined) setSeVolume(s.seVolume);
          if (s.hapticsEnabled !== undefined) setHapticsEnabled(s.hapticsEnabled);
        }
      } catch {}
    })();
  }, []);

  const persist = async (key: string, value: any) => {
    try {
      const raw = await AsyncStorage.getItem('@settings');
      const prev = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem('@settings', JSON.stringify({ ...prev, [key]: value }));
    } catch {}
  };

  const handleBgmVolume = (delta: number) => {
    const next = Math.max(0, Math.min(1, Math.round((bgmVolume + delta) * 10) / 10));
    setBgmVolume(next);
    persist('bgmVolume', next);
  };
  const handleSeVolume = (delta: number) => {
    const next = Math.max(0, Math.min(1, Math.round((seVolume + delta) * 10) / 10));
    setSeVolume(next);
    persist('seVolume', next);
  };
  const handleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    persist('hapticsEnabled', val);
  };

  const handleTutorialReset = () => {
    Alert.alert('チュートリアル', 'チュートリアルを再表示しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.removeItem('@onboarding_done');
            await AsyncStorage.removeItem('@tutorial_done');
            Alert.alert('完了', '次回起動時にチュートリアルが表示されます。');
          } catch {}
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={['#1E1B2E', '#1A0A2E', '#2D1B4E']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="戻る"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>{'← 戻る'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>設定</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* サウンド */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>サウンド</Text>

          <View style={styles.row}>
            <Text style={styles.label}>BGM音量</Text>
            <View style={styles.volumeControl}>
              <Pressable
                onPress={() => handleBgmVolume(-0.1)}
                style={styles.volumeButton}
                accessibilityLabel="BGM音量を下げる"
                accessibilityRole="button"
              >
                <Text style={styles.volumeButtonText}>−</Text>
              </Pressable>
              <View style={styles.volumeBarContainer}>
                <View style={[styles.volumeBarFill, { width: `${Math.round(bgmVolume * 100)}%` }]} />
              </View>
              <Pressable
                onPress={() => handleBgmVolume(0.1)}
                style={styles.volumeButton}
                accessibilityLabel="BGM音量を上げる"
                accessibilityRole="button"
              >
                <Text style={styles.volumeButtonText}>＋</Text>
              </Pressable>
              <Text style={styles.volumeValue}>{Math.round(bgmVolume * 100)}%</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>効果音音量</Text>
            <View style={styles.volumeControl}>
              <Pressable
                onPress={() => handleSeVolume(-0.1)}
                style={styles.volumeButton}
                accessibilityLabel="効果音音量を下げる"
                accessibilityRole="button"
              >
                <Text style={styles.volumeButtonText}>−</Text>
              </Pressable>
              <View style={styles.volumeBarContainer}>
                <View style={[styles.volumeBarFill, { width: `${Math.round(seVolume * 100)}%` }]} />
              </View>
              <Pressable
                onPress={() => handleSeVolume(0.1)}
                style={styles.volumeButton}
                accessibilityLabel="効果音音量を上げる"
                accessibilityRole="button"
              >
                <Text style={styles.volumeButtonText}>＋</Text>
              </Pressable>
              <Text style={styles.volumeValue}>{Math.round(seVolume * 100)}%</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>バイブレーション</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleHaptics}
              trackColor={{ false: '#555', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
              accessibilityLabel="バイブレーションの切り替え"
            />
          </View>
        </View>

        {/* その他 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>その他</Text>
          <Pressable
            onPress={handleTutorialReset}
            style={styles.linkRow}
            accessibilityLabel="チュートリアルを再表示"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>チュートリアルを再表示</Text>
            <Text style={styles.chevron}>></Text>
          </Pressable>
        </View>

        {/* 法的情報 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>法的情報</Text>
          <Pressable
            onPress={() => router.push('/legal')}
            style={styles.linkRow}
            accessibilityLabel="特定商取引法に基づく表記を表示"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>特定商取引法に基づく表記</Text>
            <Text style={styles.chevron}>></Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            onPress={() => router.push('/legal/privacy')}
            style={styles.linkRow}
            accessibilityLabel="プライバシーポリシーを表示"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>プライバシーポリシー</Text>
            <Text style={styles.chevron}>></Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            onPress={() => router.push('/legal/terms')}
            style={styles.linkRow}
            accessibilityLabel="利用規約を表示"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>利用規約</Text>
            <Text style={styles.chevron}>></Text>
          </Pressable>
        </View>

        {/* アプリ情報 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <View style={styles.row}>
            <Text style={styles.label}>バージョン</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor removed - using LinearGradient
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    minWidth: 60,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0EAF8',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9B8BB4',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  label: {
    fontSize: 16,
    color: '#F0EAF8',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#9B8BB4',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeButtonText: {
    fontSize: 20,
    color: '#F0EAF8',
    fontWeight: '700',
  },
  volumeBarContainer: {
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  volumeBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  volumeValue: {
    fontSize: 14,
    color: '#9B8BB4',
    width: 40,
    textAlign: 'right',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  linkText: {
    fontSize: 16,
    color: '#F0EAF8',
  },
  chevron: {
    fontSize: 16,
    color: '#9B8BB4',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
