import { useCallback, useRef } from "react";

const POOL_SIZE = 3;
const SOUND_SRC = "/assets/Hello.mp3.m4a";

export function useHelloSound() {
  const poolRef = useRef<HTMLAudioElement[]>([]);

  // Lazily initialize the pool on first use
  const getPool = useCallback(() => {
    if (poolRef.current.length === 0) {
      for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio(SOUND_SRC);
        audio.volume = 0.8;
        poolRef.current.push(audio);
      }
    }
    return poolRef.current;
  }, []);

  const playHello = useCallback(() => {
    const pool = getPool();
    // Find an available (paused or ended) instance
    let target = pool.find((a) => a.paused || a.ended);
    // If all are busy, reuse the first one
    if (!target) {
      target = pool[0];
    }
    target.currentTime = 0;
    target.play().catch(() => {});
  }, [getPool]);

  return { playHello };
}
