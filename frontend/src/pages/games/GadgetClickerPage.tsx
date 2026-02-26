import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trophy, Clock, Zap } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const GADGETS = ['🎁', '🚪', '🚁', '📚', '🔮', '⭐', '🌟', '💎', '🎯', '🔵', '🍩', '🎪', '🎨', '🎭', '🎲'];
const GAME_DURATION = 30;

interface GadgetItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  points: number;
  lifetime: number;
  born: number;
}

let nextId = 0;

function createGadget(): GadgetItem {
  const size = 40 + Math.random() * 30;
  const points = size < 55 ? 3 : size < 65 ? 2 : 1;
  return {
    id: nextId++,
    emoji: GADGETS[Math.floor(Math.random() * GADGETS.length)],
    x: 5 + Math.random() * 80,
    y: 10 + Math.random() * 75,
    size,
    points,
    lifetime: 1500 + Math.random() * 1500,
    born: Date.now(),
  };
}

export default function GadgetClickerPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('gadget_clicker_hs') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gadgets, setGadgets] = useState<GadgetItem[]>([]);
  const [combo, setCombo] = useState(0);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; points: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback((finalScore: number) => {
    setGameState('over');
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (cleanupRef.current) clearInterval(cleanupRef.current);
    setGadgets([]);
    if (finalScore > parseInt(localStorage.getItem('gadget_clicker_hs') || '0', 10)) {
      localStorage.setItem('gadget_clicker_hs', String(finalScore));
      setHighScore(finalScore);
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setGadgets([]);
    setPopEffects([]);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setScore((s) => {
            endGame(s);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawn gadgets
    spawnRef.current = setInterval(() => {
      setGadgets((prev) => {
        if (prev.length >= 8) return prev;
        return [...prev, createGadget()];
      });
    }, 600);

    // Cleanup expired gadgets
    cleanupRef.current = setInterval(() => {
      const now = Date.now();
      setGadgets((prev) => prev.filter((g) => now - g.born < g.lifetime));
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (cleanupRef.current) clearInterval(cleanupRef.current);
    };
  }, [gameState, endGame]);

  const handleClick = (gadget: GadgetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    const newCombo = combo + 1;
    const bonusMultiplier = newCombo >= 5 ? 2 : 1;
    const earned = gadget.points * bonusMultiplier;

    setCombo(newCombo);
    setScore((s) => s + earned);
    setGadgets((prev) => prev.filter((g) => g.id !== gadget.id));

    // Pop effect
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const container = (e.currentTarget as HTMLElement).closest('.game-area')?.getBoundingClientRect();
    if (container) {
      const px = ((rect.left + rect.width / 2 - container.left) / container.width) * 100;
      const py = ((rect.top + rect.height / 2 - container.top) / container.height) * 100;
      const effectId = Date.now();
      setPopEffects((prev) => [...prev, { id: effectId, x: px, y: py, points: earned }]);
      setTimeout(() => setPopEffects((prev) => prev.filter((p) => p.id !== effectId)), 700);
    }
  };

  const handleMiss = () => {
    if (gameState !== 'playing') return;
    setCombo(0);
  };

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 15 ? 'bg-dora-cyan' : timeLeft > 8 ? 'bg-dora-yellow' : 'bg-dora-red';

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-xl glass border border-dora-blue/30 flex items-center justify-center text-foreground/60 hover:text-dora-blue-light transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold gradient-text-blue">Gadget Clicker</h1>
            <p className="text-foreground/50 font-space text-sm">Click gadgets from Doraemon's pocket! 🎁</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <GlassPanel glowColor="cyan" className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap size={14} className="text-dora-cyan" />
              <span className="text-dora-cyan text-xs font-space">SCORE</span>
            </div>
            <div className="font-orbitron text-2xl font-bold text-dora-cyan">{score}</div>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={14} className="text-dora-yellow" />
              <span className="text-dora-yellow text-xs font-space">TIME</span>
            </div>
            <div className="font-orbitron text-2xl font-bold text-dora-yellow">{timeLeft}s</div>
          </GlassPanel>
          <GlassPanel glowColor="blue" className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy size={14} className="text-dora-blue-light" />
              <span className="text-dora-blue-light text-xs font-space">BEST</span>
            </div>
            <div className="font-orbitron text-2xl font-bold text-dora-blue-light">{highScore}</div>
          </GlassPanel>
        </div>

        {/* Timer bar */}
        {gameState === 'playing' && (
          <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Combo indicator */}
        {combo >= 3 && gameState === 'playing' && (
          <div className="text-center mb-2">
            <span className="font-orbitron text-sm font-bold text-dora-yellow animate-pulse">
              🔥 {combo}x COMBO! {combo >= 5 ? '2× POINTS!' : ''}
            </span>
          </div>
        )}

        {/* Game Area */}
        <GlassPanel glowColor="cyan" className="relative overflow-hidden game-area" style={{ height: '380px' }}>
          {/* Background image */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(/assets/generated/gadget-clicker-bg.dim_400x200.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="text-6xl mb-4 animate-float">🎁</div>
              <h2 className="font-orbitron text-xl font-bold text-dora-cyan mb-2">Gadget Clicker!</h2>
              <p className="text-foreground/60 font-space text-sm mb-6 max-w-xs">
                Gadgets will pop up from Doraemon's pocket! Click them fast to score points. Smaller gadgets = more points!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-2xl bg-dora-cyan/30 border border-dora-cyan/60 text-dora-cyan font-orbitron font-bold text-lg hover:bg-dora-cyan/50 transition-all duration-300 glow-cyan"
              >
                Start Game!
              </button>
            </div>
          )}

          {gameState === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
              <div className="text-5xl mb-3">
                {score >= highScore && score > 0 ? '🏆' : '😅'}
              </div>
              <h2 className="font-orbitron text-xl font-bold text-dora-yellow mb-1">
                {score >= highScore && score > 0 ? 'New High Score!' : 'Time\'s Up!'}
              </h2>
              <p className="text-foreground/60 font-space text-sm mb-1">Final Score</p>
              <div className="font-orbitron text-4xl font-bold text-dora-cyan mb-4">{score}</div>
              {score >= highScore && score > 0 && (
                <p className="text-dora-yellow font-space text-sm mb-4">🌟 Even Doraemon is impressed!</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-2xl bg-dora-cyan/30 border border-dora-cyan/60 text-dora-cyan font-orbitron font-bold hover:bg-dora-cyan/50 transition-all duration-300"
                >
                  Play Again!
                </button>
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="px-6 py-2.5 rounded-2xl glass border border-white/20 text-foreground/60 font-space hover:text-foreground transition-all duration-300"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={handleMiss}
            >
              {gadgets.map((gadget) => {
                const age = Date.now() - gadget.born;
                const opacity = Math.max(0.3, 1 - age / gadget.lifetime);
                return (
                  <button
                    key={gadget.id}
                    onClick={(e) => handleClick(gadget, e)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 active:scale-90 transition-transform duration-100 select-none"
                    style={{
                      left: `${gadget.x}%`,
                      top: `${gadget.y}%`,
                      fontSize: `${gadget.size}px`,
                      opacity,
                      filter: 'drop-shadow(0 0 8px oklch(0.7 0.2 200))',
                    }}
                  >
                    {gadget.emoji}
                  </button>
                );
              })}

              {/* Pop effects */}
              {popEffects.map((effect) => (
                <div
                  key={effect.id}
                  className="absolute pointer-events-none font-orbitron font-bold text-dora-yellow text-lg animate-ping"
                  style={{
                    left: `${effect.x}%`,
                    top: `${effect.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 30,
                  }}
                >
                  +{effect.points}
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Tips */}
        <div className="mt-4 glass rounded-2xl p-3 border border-dora-cyan/20 text-center">
          <p className="text-foreground/40 font-space text-xs">
            💡 Smaller gadgets = more points! Build combos for 2× bonus! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
