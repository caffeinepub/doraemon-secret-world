import { useState } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useBGM } from '../hooks/useBGM';

export default function FloatingMusicControl() {
  const { isPlaying, volume, togglePlay, setVolume } = useBGM();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Volume slider panel */}
      {expanded && (
        <div className="glass-strong rounded-2xl p-4 border border-dora-blue/30 glow-blue animate-fade-in-up">
          <div className="flex items-center gap-3">
            <VolumeX size={14} className="text-foreground/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 cursor-pointer"
              style={{ accentColor: 'oklch(0.55 0.22 240)' }}
            />
            <Volume2 size={14} className="text-dora-blue-light" />
          </div>
          <p className="text-center text-xs text-foreground/40 mt-2 font-space">
            {isPlaying ? '♪ Playing BGM' : '♪ BGM Paused'}
          </p>
        </div>
      )}

      {/* Main control buttons */}
      <div className="flex items-center gap-2">
        {/* Expand/collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-10 h-10 rounded-full glass border border-dora-blue/30 flex items-center justify-center text-foreground/60 hover:text-dora-blue-light transition-all duration-300 hover:border-dora-blue/60"
          aria-label="Toggle music controls"
        >
          <Music size={16} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? 'bg-dora-blue/30 border border-dora-blue/60 glow-blue text-dora-blue-light animate-pulse-glow'
              : 'glass border border-dora-blue/30 text-foreground/60 hover:text-dora-blue-light hover:border-dora-blue/60'
          }`}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </div>
  );
}
