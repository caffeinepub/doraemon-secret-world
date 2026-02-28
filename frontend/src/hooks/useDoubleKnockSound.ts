import { useEffect, useRef } from 'react';

/**
 * Plays the "Double Knock.mp3" sound on every click/touch event globally.
 * Throttled to 120ms to prevent rapid overlapping playback.
 */
export function useDoubleKnockSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayRef = useRef<number>(0);

  useEffect(() => {
    const audio = new Audio('/assets/Double Knock.mp3.m4a');
    audio.preload = 'auto';
    audioRef.current = audio;

    function playDoubleKnock() {
      const now = Date.now();
      if (now - lastPlayRef.current < 120) return;
      lastPlayRef.current = now;

      try {
        const sound = audioRef.current;
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
    };
  }, []);
}
