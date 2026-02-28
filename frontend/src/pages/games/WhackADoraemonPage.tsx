import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const GRID_SIZE = 9;
const GAME_DURATION = 30;
const CHARACTERS = ['🔵', '⭐', '🎁', '💙', '🌟'];
const MOLE_SHOW_TIME = 900;
const SPAWN_INTERVAL = 600;

interface Hole {
  id: number;
  active: boolean;
  character: string;
}

export default function WhackADoraemonPage() {
  const navigate = useNavigate();
  const [holes, setHoles] = useState<Hole[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      active: false,
      character: '🔵',
    }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const clearAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    moleTimers.current.forEach((t) => clearTimeout(t));
    moleTimers.current.clear();
  }, []);

  const hideMole = useCallback((id: number) => {
    setHoles((prev) =>
      prev.map((h) => (h.id === id ? { ...h, active: false } : h))
    );
    moleTimers.current.delete(id);
  }, []);

  const spawnMole = useCallback(() => {
    setHoles((prev) => {
      const inactive = prev.filter((h) => !h.active);
      if (inactive.length === 0) return prev;
      const target = inactive[Math.floor(Math.random() * inactive.length)];
      const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

      const timer = setTimeout(() => hideMole(target.id), MOLE_SHOW_TIME);
      moleTimers.current.set(target.id, timer);

      return prev.map((h) =>
        h.id === target.id ? { ...h, active: true, character } : h
      );
    });
  }, [hideMole]);

  const startGame = useCallback(() => {
    clearAll();
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setGameStarted(true);
    setLastHit(null);
    setHoles(
      Array.from({ length: GRID_SIZE }, (_, i) => ({
        id: i,
        active: false,
        character: '🔵',
      }))
    );

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAll();
          setGameOver(true);
          setGameStarted(false);
          setHoles(
            Array.from({ length: GRID_SIZE }, (_, i) => ({
              id: i,
              active: false,
              character: '🔵',
            }))
          );
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(spawnMole, SPAWN_INTERVAL);
  }, [clearAll, spawnMole]);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  const handleWhack = (id: number) => {
    const hole = holes.find((h) => h.id === id);
    if (!hole || !hole.active || !gameStarted) return;

    const timer = moleTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      moleTimers.current.delete(id);
    }

    setHoles((prev) =>
      prev.map((h) => (h.id === id ? { ...h, active: false } : h))
    );
    setScore((s) => s + 10 + combo * 2);
    setCombo((c) => c + 1);
    setLastHit(id);
    setTimeout(() => setLastHit(null), 300);
  };

  const timerColor =
    timeLeft > 15 ? 'text-dora-cyan' : timeLeft > 7 ? 'text-dora-yellow' : 'text-dora-red';

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-red/30 flex items-center justify-center text-foreground/60 hover:text-dora-red transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-red">Whack-a-Doraemon</h1>
            <p className="text-foreground/50 text-sm font-space">Whack them before they hide! 🔨</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <GlassPanel glowColor="red" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">SCORE</p>
            <p className="font-orbitron text-xl font-bold text-dora-red">{score}</p>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">TIME</p>
            <p className={`font-orbitron text-xl font-bold ${timerColor}`}>{timeLeft}s</p>
          </GlassPanel>
          <GlassPanel glowColor="cyan" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">COMBO</p>
            <p className="font-orbitron text-xl font-bold text-dora-cyan">x{combo}</p>
          </GlassPanel>
        </div>

        {/* Game Grid */}
        <GlassPanel glowColor="red" className="p-6 mb-4">
          {!gameStarted && !gameOver && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="text-6xl animate-bounce">🔨</div>
              <p className="font-orbitron text-xl text-dora-red font-bold">Ready to Whack?</p>
              <p className="text-foreground/50 font-space text-sm text-center">
                Characters pop up from holes. Click them fast!
              </p>
              <button onClick={startGame} className="dora-btn dora-btn-red mt-2">
                Start Game!
              </button>
            </div>
          )}

          {(gameStarted || gameOver) && (
            <div className="grid grid-cols-3 gap-4">
              {holes.map((hole) => (
                <button
                  key={hole.id}
                  onClick={() => handleWhack(hole.id)}
                  className={`
                    aspect-square rounded-2xl border-2 flex items-center justify-center
                    transition-all duration-150 relative overflow-hidden
                    ${hole.active
                      ? 'border-dora-red/60 bg-dora-red/10 cursor-pointer hover:bg-dora-red/20 active:scale-90'
                      : 'border-white/10 bg-white/5 cursor-default'
                    }
                    ${lastHit === hole.id ? 'scale-90 bg-dora-yellow/20 border-dora-yellow/60' : ''}
                  `}
                >
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <div className="w-3/4 h-1/3 rounded-full bg-black/30" />
                  </div>
                  <span
                    className={`text-4xl relative z-10 transition-all duration-150 ${
                      hole.active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {hole.character}
                  </span>
                </button>
              ))}
            </div>
          )}
        </GlassPanel>

        {gameStarted && (
          <button
            onClick={startGame}
            className="dora-btn dora-btn-red w-full flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Restart
          </button>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">🏆</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">Time's Up!</h2>
              <p className="text-foreground/70 font-nunito mb-2">
                Final Score: <span className="text-dora-red font-bold text-2xl">{score}</span>
              </p>
              <p className="text-foreground/50 font-space text-sm mb-6">
                Max Combo: x{combo}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startGame}
                  className="dora-btn dora-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Play Again
                </button>
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="dora-btn dora-btn-yellow flex-1"
                >
                  Games Hub
                </button>
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
