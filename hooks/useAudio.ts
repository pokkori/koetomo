import { useEffect, useRef, useCallback, useState } from 'react';
import { Audio } from 'expo-av';
import { isSoundMutedAsync, setSoundMutedAsync } from '../lib/streak';

let bgmRef: Audio.Sound | null = null;

/**
 * BGM・SE を管理するカスタムフック
 * 録音中は BGM を一時停止し、停止後に再開する
 */
export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isSoundMutedAsync().then((muted) => {
      isMutedRef.current = muted;
      setIsMuted(muted);
    });
  }, []);

  const loadBGM = useCallback(async (mode: 'calm' | 'normal' = 'calm') => {
    if (bgmRef) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      const bgmFile =
        mode === 'normal'
          ? // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('../assets/audio/bgm_normal.mp3')
          : // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('../assets/audio/bgm_calm.mp3');
      const { sound } = await Audio.Sound.createAsync(bgmFile, {
        isLooping: true,
        volume: isMutedRef.current ? 0 : 0.25,
        shouldPlay: !isMutedRef.current,
      });
      bgmRef = sound;
    } catch (e) {
      console.warn('[BGM] ロード失敗。音楽なしで続行:', e);
    }
  }, []);

  const pauseBGM = useCallback(async () => {
    try {
      if (bgmRef) await bgmRef.pauseAsync();
    } catch (e) {
      console.warn('[BGM] pause失敗:', e);
    }
  }, []);

  const resumeBGM = useCallback(async () => {
    if (isMutedRef.current) return;
    try {
      if (bgmRef) await bgmRef.playAsync();
    } catch (e) {
      console.warn('[BGM] resume失敗:', e);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    const newMuted = !isMutedRef.current;
    isMutedRef.current = newMuted;
    setIsMuted(newMuted);
    await setSoundMutedAsync(newMuted);
    try {
      if (bgmRef) {
        if (newMuted) {
          await bgmRef.setVolumeAsync(0);
          await bgmRef.pauseAsync();
        } else {
          await bgmRef.setVolumeAsync(0.25);
          await bgmRef.playAsync();
        }
      }
    } catch (e) {
      console.warn('[BGM] mute切り替え失敗:', e);
    }
  }, []);

  const playSE = useCallback(async (type: 'start' | 'stop' | 'save' | 'streak') => {
    if (isMutedRef.current) return;

    const paths: Record<string, unknown> = {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      start: require('../assets/audio/se_start.mp3'),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      stop: require('../assets/audio/se_stop.mp3'),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      save: require('../assets/audio/se_save.mp3'),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      streak: require('../assets/audio/se_streak.mp3'),
    };

    try {
      const { sound } = await Audio.Sound.createAsync(
        paths[type] as Parameters<typeof Audio.Sound.createAsync>[0],
        { shouldPlay: true, volume: 0.8 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (e) {
      // SE 失敗はサイレント
    }
  }, []);

  const unloadBGM = useCallback(async () => {
    try {
      if (bgmRef) {
        await bgmRef.stopAsync();
        await bgmRef.unloadAsync();
        bgmRef = null;
      }
    } catch (e) {
      console.warn('[BGM] unload失敗:', e);
    }
  }, []);

  return { loadBGM, pauseBGM, resumeBGM, toggleMute, playSE, unloadBGM, isMuted };
}
