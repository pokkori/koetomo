import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { isOnboardingDoneAsync } from '../lib/streak';
import { hasAiConsentAsync } from '../components/AiConsentModal';
import { useRouter } from 'expo-router';
import AiConsentModal from '../components/AiConsentModal';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showAiConsent, setShowAiConsent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // AI同意確認（未同意なら同意モーダルを表示）
        const consentGiven = await hasAiConsentAsync();
        if (!consentGiven) {
          setOnboardingChecked(true);
          await SplashScreen.hideAsync();
          setShowAiConsent(true);
          return;
        }

        const done = await isOnboardingDoneAsync();
        if (!done) {
          router.replace('/onboarding');
        }
      } catch (e) {
        console.warn('[Layout] onboarding check failed:', e);
      } finally {
        setOnboardingChecked(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [router]);

  const handleConsentGiven = async () => {
    setShowAiConsent(false);
    const done = await isOnboardingDoneAsync();
    if (!done) {
      router.replace('/onboarding');
    }
  };

  if (!onboardingChecked) return null;

  return (
    <>
      <StatusBar style="light" />
      <AiConsentModal visible={showAiConsent} onConsent={handleConsentGiven} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E1B2E',
          },
          headerTintColor: '#F0EAF8',
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: '#1E1B2E',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="record/index"
          options={{ title: '録音', presentation: 'modal' }}
        />
        <Stack.Screen
          name="record/result"
          options={{ title: '今日の日記', presentation: 'card' }}
        />
        <Stack.Screen
          name="diary/[id]"
          options={{ title: '日記の詳細' }}
        />
        <Stack.Screen
          name="paywall/index"
          options={{ title: 'プレミアムプラン', presentation: 'modal' }}
        />
        <Stack.Screen
          name="legal/index"
          options={{ title: '特定商取引法に基づく表記' }}
        />
        <Stack.Screen
          name="legal/privacy"
          options={{ title: 'プライバシーポリシー' }}
        />
        <Stack.Screen
          name="legal/terms"
          options={{ title: '利用規約' }}
        />
        <Stack.Screen
          name="insight"
          options={{ title: '今週のインサイト', headerShown: false }}
        />
      </Stack>
    </>
  );
}
