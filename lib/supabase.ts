import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type DiaryEntry = {
  id: string;
  user_id: string;
  recording_duration: number;
  transcription: string;
  ai_diary: string;
  ai_backchat: string | null;
  emotion_primary: 'happy' | 'sad' | 'angry' | 'anxious' | 'calm';
  emotion_score: number | null;
  emotion_tags: string[] | null;
  audio_url: string | null;
  created_at: string;
};
