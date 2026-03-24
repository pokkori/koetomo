import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { supabase, type DiaryEntry } from '../../lib/supabase';
import DiaryCard from '../../components/DiaryCard';

// ローカルモック（Supabase未接続時）
const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: '1',
    user_id: 'mock',
    recording_duration: 65,
    transcription: '今日は仕事が忙しかったけど、なんとか終わらせることができた。',
    ai_diary: '今日は仕事が立て込んでいたが、すべてのタスクを完了させることができた。達成感があり、少し誇らしい気持ちになった。',
    ai_backchat: 'よく頑張りましたね。お疲れ様でした。',
    emotion_primary: 'calm',
    emotion_score: 0.6,
    emotion_tags: ['達成感', '疲労', '日常'],
    audio_url: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    user_id: 'mock',
    recording_duration: 120,
    transcription: '友達と久しぶりに会えてすごく嬉しかった。いろんな話をして笑った。',
    ai_diary: '久しぶりに旧友と再会し、たくさん笑って話した。こんなに心から笑ったのは久しぶりだと気づいた。',
    ai_backchat: '嬉しかったんですね。素敵な時間でしたね。',
    emotion_primary: 'happy',
    emotion_score: 0.9,
    emotion_tags: ['友情', '喜び', '笑い'],
    audio_url: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error || !data || data.length === 0) {
          setEntries(MOCK_ENTRIES);
        } else {
          setEntries(data as DiaryEntry[]);
        }
      } catch {
        setEntries(MOCK_ENTRIES);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>まだ日記がありません</Text>
            <Text style={styles.emptySubtext}>
              ホーム画面から録音を始めてみましょう
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="ホーム画面に移動する"
            >
              <Text style={styles.emptyButtonText}>ホームへ</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onPress={() =>
              router.push({
                pathname: '/diary/[id]',
                params: { id: item.id },
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 0,
  },
  separator: {
    height: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
