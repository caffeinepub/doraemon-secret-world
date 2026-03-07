import { useCallback, useEffect, useRef, useState } from "react";
import bgmUrl from "/assets/_Doraemon_Lofi_Instrumental_Ringtone_(by Fringster.com).mp3";

let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;
const listeners: Set<(playing: boolean) => void> = new Set();

function notifyListeners(playing: boolean) {
  globalIsPlaying = playing;
  for (const fn of listeners) fn(playing);
}

export function useBGM() {
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [volume, setVolumeState] = useState(0.5);
  const hasInteracted = useRef(false);

  useEffect(() => {
    listeners.add(setIsPlaying);
    return () => {
      listeners.delete(setIsPlaying);
    };
  }, []);

  useEffect(() => {
    if (!globalAudio) {
      globalAudio = new Audio(bgmUrl);
      globalAudio.loop = true;
      globalAudio.volume = 0.5;

      globalAudio.addEventListener("play", () => notifyListeners(true));
      globalAudio.addEventListener("pause", () => notifyListeners(false));
      globalAudio.addEventListener("ended", () => notifyListeners(false));

      // Try autoplay
      globalAudio.play().catch(() => {
        // Autoplay blocked, wait for user interaction
        const tryPlay = () => {
          if (!hasInteracted.current && globalAudio) {
            hasInteracted.current = true;
            globalAudio.play().catch(() => {});
            document.removeEventListener("click", tryPlay, true);
            document.removeEventListener("touchstart", tryPlay, true);
            document.removeEventListener("keydown", tryPlay, true);
          }
        };
        document.addEventListener("click", tryPlay, true);
        document.addEventListener("touchstart", tryPlay, true);
        document.addEventListener("keydown", tryPlay, true);
      });
    }
  }, []);

  const play = useCallback(() => {
    if (globalAudio) {
      globalAudio.play().catch(() => {});
    }
  }, []);

  const pause = useCallback(() => {
    if (globalAudio) {
      globalAudio.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (globalIsPlaying) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (globalAudio) {
      globalAudio.volume = v;
    }
  }, []);

  return { isPlaying, play, pause, toggle, volume, setVolume };
}
