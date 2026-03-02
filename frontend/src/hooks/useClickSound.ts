import { useEffect, useRef } from 'react';

/**
 * Synthesizes a Doraemon-style two-note bell chime using the Web Audio API.
 * No external audio file required — fully synthesized.
 * Plays on every global click and touchstart event with 120ms throttling.
 */
export function useClickSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPlayRef = useRef<number>(0);

  useEffect(() => {
    function getCtx(): AudioContext | null {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          )();
        }
        return audioCtxRef.current;
      } catch {
        return null;
      }
    }

    function playDoraemonChime() {
      const now = Date.now();
      if (now - lastPlayRef.current < 120) return;
      lastPlayRef.current = now;

      try {
        const ctx = getCtx();
        if (!ctx) return;

        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const currentTime = ctx.currentTime;

        // Doraemon-style: two-note cheerful bell chime (C6 → E6)
        const notes = [1046.5, 1318.5]; // C6, E6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, currentTime + i * 0.07);

          gainNode.gain.setValueAtTime(0, currentTime + i * 0.07);
          gainNode.gain.linearRampToValueAtTime(0.18, currentTime + i * 0.07 + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.07 + 0.35);

          osc.start(currentTime + i * 0.07);
          osc.stop(currentTime + i * 0.07 + 0.4);
        });

        // Sparkle overtone
        const sparkle = ctx.createOscillator();
        const sparkleGain = ctx.createGain();
        sparkle.connect(sparkleGain);
        sparkleGain.connect(ctx.destination);
        sparkle.type = 'sine';
        sparkle.frequency.setValueAtTime(2637, currentTime); // E7
        sparkleGain.gain.setValueAtTime(0, currentTime);
        sparkleGain.gain.linearRampToValueAtTime(0.06, currentTime + 0.005);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.18);
        sparkle.start(currentTime);
        sparkle.stop(currentTime + 0.2);
      } catch {
        // Silently ignore audio errors
      }
    }

    const handleClick = () => playDoraemonChime();
    const handleTouch = () => playDoraemonChime();

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);
}
