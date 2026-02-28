import { useEffect, useRef } from 'react';

/**
 * Plays a Doraemon-style chime sound on every click/touch using the Web Audio API.
 * The sound is synthesized (no external file needed) — a cheerful bell chime
 * reminiscent of Doraemon's gadget sounds.
 */
export function useClickSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPlayRef = useRef<number>(0);

  useEffect(() => {
    function getCtx(): AudioContext {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      return audioCtxRef.current;
    }

    function playDoraemonChime() {
      const now = Date.now();
      // Throttle: don't play more than once every 120ms to avoid audio spam
      if (now - lastPlayRef.current < 120) return;
      lastPlayRef.current = now;

      try {
        const ctx = getCtx();

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

          // Quick attack, fast decay — bell-like
          gainNode.gain.setValueAtTime(0, currentTime + i * 0.07);
          gainNode.gain.linearRampToValueAtTime(0.18, currentTime + i * 0.07 + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + i * 0.07 + 0.35);

          osc.start(currentTime + i * 0.07);
          osc.stop(currentTime + i * 0.07 + 0.4);
        });

        // Add a tiny sparkle overtone (higher harmonic)
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
        // Silently ignore audio errors (e.g., browser restrictions)
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
