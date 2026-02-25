import { useRef, useState, useEffect, useCallback } from 'react';

export function useBGM() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Create a gentle ambient tone using Web Audio API as fallback
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => setIsReady(true));
    audio.addEventListener('error', () => {
      // Audio file not available, that's okay
      setIsReady(false);
    });

    // Try to load the BGM file
    audio.src = '/assets/audio/doraemon-bgm.mp3';
    audio.load();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && isReady) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((level: number) => {
    setVolumeState(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  return { isPlaying, volume, isReady, play, pause, togglePlay, setVolume };
}
