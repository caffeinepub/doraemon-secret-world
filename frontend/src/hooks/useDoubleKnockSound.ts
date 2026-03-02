import { useEffect, useRef } from 'react';

/**
 * Plays the "Double Knock.mp3.m4a" sound on every click/touch event globally.
 * Audio file: /assets/Double Knock.mp3.m4a
 * Throttled to 120ms to prevent rapid overlapping playback.
 */
export function useDoubleKnockSound() {
  const lastPlayRef = useRef<number>(0);
  // Keep a pool of audio elements to allow overlapping if needed
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    // Pre-load a few audio instances for quick playback
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < 3; i++) {
      const a = new Audio('/assets/Double Knock.mp3.m4a');
      a.preload = 'auto';
      a.volume = 0.6;
      pool.push(a);
    }
    audioPoolRef.current = pool;

    function playDoubleKnock() {
      const now = Date.now();
      if (now - lastPlayRef.current < 120) return;
      lastPlayRef.current = now;

      try {
        // Find an audio element that is not currently playing
        const available = audioPoolRef.current.find((a) => a.paused || a.ended);
        const sound = available ?? audioPoolRef.current[0];
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {
          // Silently ignore autoplay policy errors
        });
      } catch {
        // Silently ignore audio errors
      }
    }

    const handleClick = () => playDoubleKnock();
    const handleTouch = () => playDoubleKnock();

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
      audioPoolRef.current.forEach((a) => {
        a.pause();
        a.src = '';
      });
      audioPoolRef.current = [];
    };
  }, []);
}
