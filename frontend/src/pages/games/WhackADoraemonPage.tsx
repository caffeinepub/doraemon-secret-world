import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trophy, Clock, Heart } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const GAME_DURATION = 45;
const GRID_SIZE = 9; // 3x3

const CHARACTERS = [
  { emoji: '🔵', name: 'Doraemon', points: 1 },
  { emoji: '🧒', name: 'Nobita', points: 2 },
  { emoji: '🌸', name: 'Shizuka', points: 3 },
  { emoji: '💪', name: 'Gian', points: 1 },
  { emoji: '🤑', name: 'Suneo', points: 2 },
];

const BOMB = { emoji: '💣', name: 'Bomb', points: -3 };

interface HoleState {
  active: boolean;
  character: typeof CHARACTERS[0] | typeof BOMB | null;
  hit: boolean;
  miss: boolean;
}

function createHoles(): HoleState[] {
  return Array.from({ length: GRID_SIZE }, () => ({
    active: false,
    character: null,
    hit: false,
    miss: false,
  }));
}

export default function WhackADoraemonPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [holes, setHoles] = useState<HoleState[]>(createHoles());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('whack_hs') || '0', 10)
  );
  const [combo, setCombo] = useState(0);
  const [lastHit, setLastHit] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const endGame = useCallback((finalScore: number) => {
    setGameState('over');
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    activeTimers.current.forEach((t) => clearTimeout(t));
    activeTimers.current.clear();
    setHoles(createHoles());
    if (finalScore > parseInt(localStorage.getItem('whack_hs') || '0', 10)) {
      localStorage.setItem('whack_hs', String(finalScore));
      setHighScore(finalScore);
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setHoles(createHoles());
    setLastHit(null);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // Countdown timer
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

    // Spawn characters
    spawnRef.current = setInterval(() => {
      setHoles((prev) => {
        const inactive = prev.map((h, i) => (!h.active ? i : -1)).filter((i) => i >= 0);
        if (inactive.length === 0) return prev;

        const holeIdx = inactive[Math.floor(Math.random() * inactive.length)];
        const isBomb = Math.random() < 0.15;
        const char = isBomb ? BOMB : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

        const newHoles = prev.map((h, i) =>
          i === holeIdx ? { ...h, active: true, character: char, hit: false, miss: false } : h
        );

        // Auto-hide after duration
        const hideDelay = 1200 + Math.random() * 800;
        const t = setTimeout(() => {
          setHoles((current) =>
            current.map((h, i) => {
              if (i === holeIdx && h.active && !h.hit) {
                // Missed a character (not bomb)
                if (!isBomb) {
                  setCombo(0);
                }
                return { ...h, active: false, character: null, miss: !isBomb };
              }
              return h;
            })
          );
          // Clear miss indicator
          setTimeout(() => {
            setHoles((current) =>
              current.map((h, i) => (i === holeIdx ? { ...h, miss: false } : h))
            );
          }, 400);
          activeTimers.current.delete(holeIdx);
        }, hideDelay);

        activeTimers.current.set(holeIdx, t);
        return newHoles;
      });
    }, 700);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      activeTimers.current.forEach((t) => clearTimeout(t));
      activeTimers.current.clear();
    };
  }, [gameState, endGame]);

  const handleWhack = (idx: number) => {
    if (gameState !== 'playing') return;
    const hole = holes[idx];
    if (!hole.active || hole.hit) return;

    const char = hole.character;
    if (!char) return;

    // Clear the auto-hide timer
    const t = activeTimers.current.get(idx);
    if (t) {
      clearTimeout(t);
      activeTimers.current.delete(idx);
    }

    if (char === BOMB) {
      // Hit a bomb!
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setScore((s) => {
            endGame(s);
            return s;
          });
        }
        return newLives;
      });
      setCombo(0);
      setLastHit('💥 BOMB! -1 Life!');
      setHoles((prev) =>
        prev.map((h, i) => (i === idx ? { ...h, active: false, character: null, hit: true } : h))
      );
    } else {
      const newCombo = combo + 1;
      const bonus = newCombo >= 5 ? 2 : 1;
      const earned = char.points * bonus;
      setCombo(newCombo);
      setScore((s) => s + earned);
      setLastHit(`+${earned} ${char.name}!${newCombo >= 5 ? ' 🔥' : ''}`);
      setHoles((prev) =>
        prev.map((h, i) => (i === idx ? { ...h, hit: true } : h))
      );
      setTimeout(() => {
        setHoles((prev) =>
          prev.map((h, i) => (i === idx ? { ...h, active: false, character: null, hit: false } : h))
        );
      }, 300);
    }

    setTimeout(() => setLastHit(null), 800);
  };

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 20 ? 'bg-dora-cyan' : timeLeft > 10 ? 'bg-dora-yellow' : 'bg-dora-red';

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-xl glass border border-dora-red/30 flex items-center justify-center text-foreground/60 hover:text-dora-red transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-red">Whack-a-Doraemon!</h1>
            <p className="text-foreground/50 font-space text-sm">Whack characters, avoid bombs! 🔨</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <GlassPanel glowColor="red" className="p-2 text-center">
            <div className="text-dora-red text-xs font-space mb-0.5">SCORE</div>
            <div className="font-orbitron text-xl font-bold text-dora-red">{score}</div>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Clock size={10} className="text-dora-yellow" />
              <span className="text-dora-yellow text-xs font-space">TIME</span>
            </div>
            <div className="font-orbitron text-xl font-bold text-dora-yellow">{timeLeft}s</div>
          </GlassPanel>
          <GlassPanel glowColor="blue" className="p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Heart size={10} className="text-dora-red" />
              <span className="text-dora-red text-xs font-space">LIVES</span>
            </div>
            <div className="font-orbitron text-xl font-bold text-dora-red">
              {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}
            </div>
          </GlassPanel>
          <GlassPanel glowColor="blue" className="p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Trophy size={10} className="text-dora-blue-light" />
              <span className="text-dora-blue-light text-xs font-space">BEST</span>
            </div>
            <div className="font-orbitron text-xl font-bold text-dora-blue-light">{highScore}</div>
          </GlassPanel>
        </div>

        {/* Timer bar */}
        {gameState === 'playing' && (
          <div className="w-full h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Hit feedback */}
        <div className="h-6 text-center mb-2">
          {lastHit && (
            <span className="font-orbitron text-sm font-bold text-dora-yellow animate-bounce">
              {lastHit}
            </span>
          )}
          {combo >= 3 && gameState === 'playing' && !lastHit && (
            <span className="font-orbitron text-sm font-bold text-dora-cyan">
              🔥 {combo}x COMBO!
            </span>
          )}
        </div>

        {/* Game Grid */}
        <GlassPanel glowColor="red" className="p-4">
          {gameState === 'idle' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4 animate-float">🔨</div>
              <h2 className="font-orbitron text-xl font-bold text-dora-red mb-2">Whack-a-Doraemon!</h2>
              <p className="text-foreground/60 font-space text-sm mb-2">
                Characters pop up from holes — whack them to score!
              </p>
              <p className="text-dora-red/70 font-space text-xs mb-6">
                ⚠️ Avoid the 💣 bombs or lose a life!
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-space text-center">
                {CHARACTERS.map((c) => (
                  <div key={c.name} className="glass rounded-xl p-2 border border-white/10">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="text-foreground/60">{c.name}</div>
                    <div className="text-dora-yellow font-bold">+{c.points} pts</div>
                  </div>
                ))}
                <div className="glass rounded-xl p-2 border border-dora-red/30">
                  <div className="text-2xl">{BOMB.emoji}</div>
                  <div className="text-foreground/60">{BOMB.name}</div>
                  <div className="text-dora-red font-bold">-1 Life!</div>
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-2xl bg-dora-red/30 border border-dora-red/60 text-dora-red font-orbitron font-bold text-lg hover:bg-dora-red/50 transition-all duration-300 glow-red"
              >
                Start Whacking! 🔨
              </button>
            </div>
          )}

          {gameState === 'over' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">
                {score >= highScore && score > 0 ? '🏆' : lives <= 0 ? '💔' : '⏰'}
              </div>
              <h2 className="font-orbitron text-xl font-bold text-dora-yellow mb-1">
                {lives <= 0 ? 'No More Lives!' : 'Time\'s Up!'}
              </h2>
              {score >= highScore && score > 0 && (
                <p className="text-dora-yellow font-space text-sm mb-2">🌟 New High Score!</p>
              )}
              <div className="font-orbitron text-4xl font-bold text-dora-red mb-4">{score}</div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-2xl bg-dora-red/30 border border-dora-red/60 text-dora-red font-orbitron font-bold hover:bg-dora-red/50 transition-all duration-300"
                >
                  Play Again! 🔨
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
            <div className="grid grid-cols-3 gap-3">
              {holes.map((hole, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWhack(idx)}
                  className="relative aspect-square rounded-2xl overflow-hidden transition-all duration-150 select-none"
                  style={{ cursor: hole.active ? 'pointer' : 'default' }}
                >
                  {/* Hole background */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 border-dora-blue/20"
                    style={{
                      backgroundImage: 'url(/assets/generated/game-hole.dim_128x128.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl" />

                  {/* Character */}
                  {hole.active && hole.character && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ${
                        hole.hit ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                      }`}
                    >
                      <span
                        className="text-4xl drop-shadow-lg"
                        style={{
                          filter: hole.character === BOMB
                            ? 'drop-shadow(0 0 8px oklch(0.6 0.25 30))'
                            : 'drop-shadow(0 0 8px oklch(0.7 0.2 200))',
                        }}
                      >
                        {hole.character.emoji}
                      </span>
                    </div>
                  )}

                  {/* Miss indicator */}
                  {hole.miss && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-dora-red text-2xl font-bold opacity-70">✗</span>
                    </div>
                  )}

                  {/* Hole number (when empty) */}
                  {!hole.active && !hole.miss && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-4 rounded-full bg-black/60 border border-white/10" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Legend */}
        {gameState === 'playing' && (
          <div className="mt-3 glass rounded-xl p-2 border border-white/10 flex flex-wrap gap-2 justify-center">
            {CHARACTERS.map((c) => (
              <span key={c.name} className="text-xs font-space text-foreground/40">
                {c.emoji} +{c.points}
              </span>
            ))}
            <span className="text-xs font-space text-dora-red/60">💣 -1 Life</span>
            <span className="text-xs font-space text-dora-yellow/60">🔥 5+ combo = 2×</span>
          </div>
        )}
      </div>
    </div>
  );
}
