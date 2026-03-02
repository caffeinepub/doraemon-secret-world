import { useEffect, useRef } from "react";

const POOL_SIZE = 3;
const THROTTLE_MS = 120;

export function useDoubleKnockSound() {
  const poolRef = useRef<HTMLAudioElement[]>([]);
  const poolIndexRef = useRef(0);
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    // Pre-load audio pool
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio("/assets/Double Knock.mp3.m4a");
      audio.volume = 0.4;
      pool.push(audio);
    }
    poolRef.current = pool;

    const handleClick = () => {
      const now = Date.now();
      if (now - lastPlayedRef.current < THROTTLE_MS) return;
      lastPlayedRef.current = now;

      const audio = poolRef.current[poolIndexRef.current % POOL_SIZE];
      poolIndexRef.current++;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("touchstart", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("touchstart", handleClick, true);
      for (const a of pool) {
        a.pause();
        a.src = "";
      }
    };
  }, []);
}
