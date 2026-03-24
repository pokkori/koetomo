import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const MAX_FREE_SECONDS = 180; // 無料3分上限

export type RecordingState = 'idle' | 'recording' | 'processing';

export function useRecording(isPremium: boolean, onLimitReached: () => void) {
  const [state, setState] = useState<RecordingState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setState('recording');
      setElapsedSeconds(0);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // 無料プランの制限チェック（残り20秒で警告、上限で停止）
          if (!isPremium && next >= MAX_FREE_SECONDS) {
            stopRecording();
            onLimitReached();
          }
          return next;
        });
      }, 1000);
    } catch (e) {
      console.warn('[Recording] 録音開始失敗:', e);
      setState('idle');
    }
  }, [isPremium, onLimitReached]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState('processing');

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setAudioUri(uri);
      return uri;
    } catch (e) {
      console.warn('[Recording] 録音停止失敗:', e);
      setState('idle');
      return null;
    }
  }, []);

  const resetRecording = useCallback(() => {
    setState('idle');
    setElapsedSeconds(0);
    setAudioUri(null);
  }, []);

  const remainingFreeSeconds = isPremium ? null : Math.max(0, MAX_FREE_SECONDS - elapsedSeconds);
  const isNearLimit = !isPremium && elapsedSeconds >= MAX_FREE_SECONDS - 20;

  return {
    state,
    elapsedSeconds,
    audioUri,
    remainingFreeSeconds,
    isNearLimit,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
