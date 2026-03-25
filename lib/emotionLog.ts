import AsyncStorage from '@react-native-async-storage/async-storage';

const ENTRIES_KEY = '@koetomo/emotion_entries';

export interface EmotionEntry {
  id: string;
  date: string;       // ISO 8601 (e.g. "2026-03-25T20:00:00.000Z")
  emotion: string;    // emotion id from EMOTIONS
  note: string;       // 音声→テキスト変換後のメモ（空文字可）
  intensity: number;  // 1-5
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function loadAllEntries(): Promise<EmotionEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EmotionEntry[];
  } catch {
    return [];
  }
}

async function saveAllEntries(entries: EmotionEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

/** 1件のエントリを保存して返す */
export async function saveEmotionEntry(
  entry: Omit<EmotionEntry, 'id'>
): Promise<EmotionEntry> {
  const newEntry: EmotionEntry = { ...entry, id: generateId() };
  const all = await loadAllEntries();
  all.push(newEntry);
  await saveAllEntries(all);
  return newEntry;
}

/** 過去 days 日分の全エントリを返す（新しい順） */
export async function getRecentEntries(days: number): Promise<EmotionEntry[]> {
  const all = await loadAllEntries();
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  return all
    .filter((e) => e.date >= cutoff)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** 今日（JST）のエントリを返す */
export async function getTodayEntry(): Promise<EmotionEntry | null> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await loadAllEntries();
  const todayEntries = all
    .filter((e) => e.date.slice(0, 10) === today)
    .sort((a, b) => b.date.localeCompare(a.date));
  return todayEntries[0] ?? null;
}

/** 週次集計: 感情ID → 件数のマップ（直近7日） */
export async function getWeeklyStats(): Promise<Record<string, number>> {
  const entries = await getRecentEntries(7);
  const stats: Record<string, number> = {};
  for (const e of entries) {
    stats[e.emotion] = (stats[e.emotion] ?? 0) + 1;
  }
  return stats;
}

/** 月次集計: 感情ID → 件数のマップ（直近30日） */
export async function getMonthlyStats(): Promise<Record<string, number>> {
  const entries = await getRecentEntries(30);
  const stats: Record<string, number> = {};
  for (const e of entries) {
    stats[e.emotion] = (stats[e.emotion] ?? 0) + 1;
  }
  return stats;
}

/** 先週（7〜14日前）の週次集計 */
export async function getPreviousWeekStats(): Promise<Record<string, number>> {
  const all = await loadAllEntries();
  const now = Date.now();
  const start = new Date(now - 14 * 86400000).toISOString();
  const end = new Date(now - 7 * 86400000).toISOString();
  const entries = all.filter((e) => e.date >= start && e.date < end);
  const stats: Record<string, number> = {};
  for (const e of entries) {
    stats[e.emotion] = (stats[e.emotion] ?? 0) + 1;
  }
  return stats;
}

/** 今週の支配的感情（最多）を返す */
export async function getDominantEmotionThisWeek(): Promise<string | null> {
  const stats = await getWeeklyStats();
  const entries = Object.entries(stats);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}
