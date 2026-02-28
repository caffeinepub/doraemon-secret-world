import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const GADGETS = ['🎁', '🔔', '🌟', '💫', '⭐', '🎀', '🎊', '🔵', '💙', '✨'];
const GAME_DURATION = 30;
const MAX_GADGETS = 6;

interface GadgetItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  lifetime: number;
}

let nextId = 0;

export default function GadgetClickerPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gadgets, setGadgets] = useState<GadgetItem[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [missed, setMissed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gadgetTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    gadgetTimers.current.forEach((t) => clearTimeout(t));
    gadgetTimers.current.clear();
  }, []);

  const spawnGadget = useCallback(() => {
    setGadgets((prev) => {
      if (prev.length >= MAX_GADGETS) return prev;
      const id = nextId++;
      const newGadget: GadgetItem = {
        id,
        emoji: GADGETS[Math.floor(Math.random() * GADGETS.length)],
        x: 5 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        lifetime: 1500 + Math.random() * 1500,
      };

      const timer = setTimeout(() => {
        setGadgets((g) => {
          const exists = g.find((item) => item.id === id);
          if (exists) setMissed((m) => m + 1);
          return g.filter((item) => item.id !== id);
        });
        gadgetTimers.current.delete(id);
      }, newGadget.lifetime);

      gadgetTimers.current.set(id, timer);
      return [...prev, newGadget];
    });
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setGadgets([]);
    setGameOver(false);
    setGameStarted(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAllTimers();
          setGameOver(true);
          setGameStarted(false);
          setGadgets([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(spawnGadget, 700);
  }, [clearAllTimers, spawnGadget]);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const handleClick = (id: number) => {
    const timer = gadgetTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      gadgetTimers.current.delete(id);
    }
    setGadgets((prev) => prev.filter((g) => g.id !== id));
    setScore((s) => s + 10);
  };

  const timerColor =
    timeLeft > 15 ? 'text-dora-cyan' : timeLeft > 7 ? 'text-dora-yellow' : 'text-dora-red';

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-cyan/30 flex items-center justify-center text-foreground/60 hover:text-dora-cyan transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-cyan">Gadget Clicker</h1>
            <p className="text-foreground/50 text-sm font-space">Click gadgets before they vanish! 🎁</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <GlassPanel glowColor="cyan" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">SCORE</p>
            <p className="font-orbitron text-xl font-bold text-dora-cyan">{score}</p>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">TIME</p>
            <p className={`font-orbitron text-xl font-bold ${timerColor}`}>{timeLeft}s</p>
          </GlassPanel>
          <GlassPanel glowColor="red" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">MISSED</p>
            <p className="font-orbitron text-xl font-bold text-dora-red">{missed}</p>
          </GlassPanel>
        </div>

        {/* Game Area */}
        <GlassPanel glowColor="cyan" className="relative overflow-hidden mb-4" style={{ height: '380px' }}>
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl animate-bounce">🎁</div>
              <p className="font-orbitron text-xl text-dora-cyan font-bold">Ready to Click?</p>
              <p className="text-foreground/50 font-space text-sm text-center px-8">
                Gadgets will pop up randomly. Click them fast before they disappear!
              </p>
              <button onClick={startGame} className="dora-btn dora-btn-primary mt-2">
                Start Game!
              </button>
            </div>
          )}

          {gameStarted && gadgets.map((g) => (
            <button
              key={g.id}
              onClick={() => handleClick(g.id)}
              className="absolute text-4xl hover:scale-125 active:scale-90 transition-transform duration-100"
              style={{ left: `${g.x}%`, top: `${g.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {g.emoji}
            </button>
          ))}

          {gameStarted && gadgets.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-foreground/30 font-space text-sm">Gadgets incoming...</p>
            </div>
          )}
        </GlassPanel>

        {gameStarted && (
          <button
            onClick={startGame}
            className="dora-btn dora-btn-primary w-full flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Restart
          </button>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">🎊</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">Time's Up!</h2>
              <p className="text-foreground/70 font-nunito mb-2">
                Final Score: <span className="text-dora-cyan font-bold text-2xl">{score}</span>
              </p>
              <p className="text-foreground/50 font-space text-sm mb-6">
                Missed: {missed} gadgets
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
