import { Slider } from "@/components/ui/slider";
import { Music, Pause, Play, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { useBGM } from "../hooks/useBGM";

export default function FloatingMusicControl() {
  const { isPlaying, toggle, volume, setVolume } = useBGM();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3 min-w-[160px]">
          <Volume2 className="w-4 h-4 text-white/70 shrink-0" />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([v]) => setVolume(v)}
            className="flex-1"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle volume"
        >
          <Music className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggle}
          className="bg-doraemon-blue/80 backdrop-blur-md border border-white/30 rounded-full p-3 text-white shadow-lg hover:bg-doraemon-blue transition-colors"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      </div>
      {isPlaying && (
        <div className="flex gap-0.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 bg-doraemon-blue rounded-full animate-bounce"
              style={{
                height: "12px",
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
