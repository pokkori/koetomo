import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@koetomo/streak_days';
const STREAK_DATE_KEY = '@koetomo/streak_last_date';
const ONBOARDING_KEY = '@koetomo/onboarding_done';
const SOUND_MUTED_KEY = '@koetomo/sound_muted';

export async function updateStreakAsync(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = await AsyncStorage.getItem(STREAK_DATE_KEY);
  const streakStr = await AsyncStorage.getItem(STREAK_KEY);
  let streak = streakStr ? parseInt(streakStr, 10) : 0;

  if (lastDate === today) {
    // 今日はすでに録音済み
    return streak;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastDate === yesterday) {
    streak += 1;
  } else if (lastDate) {
    streak = 1; // 途切れリセット
  } else {
    streak = 1; // 初回
  }

  await AsyncStorage.setItem(STREAK_KEY, String(streak));
  await AsyncStorage.setItem(STREAK_DATE_KEY, today);
  return streak;
}

export async function getStreakAsync(): Promise<number> {
  const streakStr = await AsyncStorage.getItem(STREAK_KEY);
  return streakStr ? parseInt(streakStr, 10) : 0;
}

export function shouldShowStreakMilestone(streak: number): boolean {
  return streak > 0 && (streak === 7 || streak === 30 || streak === 100);
}

export async function isOnboardingDoneAsync(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}

export async function setOnboardingDoneAsync(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function isSoundMutedAsync(): Promise<boolean> {
  const val = await AsyncStorage.getItem(SOUND_MUTED_KEY);
  return val === 'true';
}

export async function setSoundMutedAsync(muted: boolean): Promise<void> {
  await AsyncStorage.setItem(SOUND_MUTED_KEY, muted ? 'true' : 'false');
}
