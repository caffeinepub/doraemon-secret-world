import { useRef, useState, useEffect, useCallback } from 'react';

// Audio file: /assets/Dreamy.mp3.m4a
const BGM_SRC = '/assets/Dreamy.mp3.m4a';

export function useBGM() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const interactionListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Sync isPlaying state with actual audio events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    audio.addEventListener('error', (e) => {
      console.warn('BGM audio error:', e);
      setIsPlaying(false);
    });

    // Attempt autoplay immediately; if blocked, wait for first user gesture
    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — set up one-time interaction listener
        const resumeOnInteraction = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', resumeOnInteraction, true);
          document.removeEventListener('touchstart', resumeOnInteraction, true);
          interactionListenersRef.current = null;
        };
        document.addEventListener('click', resumeOnInteraction, { capture: true, passive: true });
        document.addEventListener('touchstart', resumeOnInteraction, { capture: true, passive: true });
        interactionListenersRef.current = resumeOnInteraction;
      });
    };

    tryPlay();

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      // Clean up pending interaction listeners
      if (interactionListenersRef.current) {
        document.removeEventListener('click', interactionListenersRef.current, true);
        document.removeEventListener('touchstart', interactionListenersRef.current, true);
      }
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, []);

  const setVolume = useCallback((level: number) => {
    setVolumeState(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  return { isPlaying, volume, play, pause, togglePlay, setVolume };
}
