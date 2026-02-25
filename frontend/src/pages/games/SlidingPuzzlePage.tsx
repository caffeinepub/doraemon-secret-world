import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

const TILE_EMOJIS = ['🔵', '⭐', '💙', '🎁', '🌟', '🤝', '✨', '💫'];

function createSolvedState(): number[] {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i);
}

function getNeighbors(idx: number): number[] {
  const row = Math.floor(idx / GRID_SIZE);
  const col = idx % GRID_SIZE;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(idx - GRID_SIZE);
  if (row < GRID_SIZE - 1) neighbors.push(idx + GRID_SIZE);
  if (col > 0) neighbors.push(idx - 1);
  if (col < GRID_SIZE - 1) neighbors.push(idx + 1);
  return neighbors;
}

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  let emptyIdx = TOTAL_TILES - 1;
  for (let i = 0; i < 200; i++) {
    const neighbors = getNeighbors(emptyIdx);
    const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    [a[emptyIdx], a[randNeighbor]] = [a[randNeighbor], a[emptyIdx]];
    emptyIdx = randNeighbor;
  }
  return a;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((val, idx) => val === idx);
}

const TILE_COLORS = [
  'bg-dora-blue/30 border-dora-blue/50',
  'bg-dora-yellow/30 border-dora-yellow/50',
  'bg-dora-red/30 border-dora-red/50',
  'bg-dora-cyan/30 border-dora-cyan/50',
  'bg-dora-blue/20 border-dora-blue/40',
  'bg-dora-yellow/20 border-dora-yellow/40',
  'bg-dora-red/20 border-dora-red/40',
  'bg-dora-cyan/20 border-dora-cyan/40',
];

export default function SlidingPuzzlePage() {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<number[]>(() => shuffle(createSolvedState()));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [won, startTime]);

  const handleTileClick = useCallback((idx: number) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(TOTAL_TILES - 1);
    const neighbors = getNeighbors(emptyIdx);
    if (!neighbors.includes(idx)) return;

    const newTiles = [...tiles];
    [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
    setTiles(newTiles);
    setMoves((m) => m + 1);

    if (isSolved(newTiles)) {
      setWon(true);
    }
  }, [tiles, won]);

  const handleReset = () => {
    setTiles(shuffle(createSolvedState()));
    setMoves(0);
    setWon(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-blue/30 flex items-center justify-center text-foreground/60 hover:text-dora-blue-light transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold gradient-text-blue">Sliding Puzzle</h1>
            <p className="text-foreground/50 text-sm font-space">Arrange the tiles in order!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassPanel glowColor="blue" className="p-4 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">MOVES</p>
            <p className="font-orbitron text-2xl font-bold text-dora-blue-light">{moves}</p>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-4 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">TIME</p>
            <p className="font-orbitron text-2xl font-bold text-dora-yellow">{formatTime(elapsed)}</p>
          </GlassPanel>
        </div>

        {/* Puzzle Grid */}
        <GlassPanel glowColor="blue" className="p-6 mb-6">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {tiles.map((tileVal, idx) => {
              const isEmpty = tileVal === TOTAL_TILES - 1;
              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={isEmpty || won}
                  className={`
                    aspect-square rounded-xl border-2 flex items-center justify-center
                    transition-all duration-200 puzzle-tile
                    ${isEmpty
                      ? 'bg-transparent border-dora-blue/10 cursor-default'
                      : `${TILE_COLORS[tileVal % TILE_COLORS.length]} hover:brightness-125 active:scale-95 cursor-pointer`
                    }
                  `}
                >
                  {!isEmpty && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl">{TILE_EMOJIS[tileVal % TILE_EMOJIS.length]}</span>
                      <span className="font-orbitron text-xs font-bold text-foreground/60">
                        {tileVal + 1}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </GlassPanel>

        {/* Target order hint */}
        <div className="glass rounded-xl p-3 border border-dora-blue/20 mb-6 text-center">
          <p className="text-foreground/40 text-xs font-space">
            Goal: Arrange tiles 1–{TOTAL_TILES - 1} in order, empty space at bottom-right
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {TILE_EMOJIS.slice(0, GRID_SIZE * GRID_SIZE - 1).map((e, i) => (
              <span key={i} className="text-sm">{e}</span>
            ))}
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="dora-btn dora-btn-primary w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          New Puzzle
        </button>

        {/* Win Modal */}
        {won && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4 animate-bounce-in">
              <div className="text-6xl mb-4">🏆</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">
                Puzzle Solved!
              </h2>
              <p className="text-foreground/70 font-nunito mb-4">
                Amazing! You solved it in{' '}
                <span className="text-dora-blue-light font-bold">{moves} moves</span>{' '}
                and{' '}
                <span className="text-dora-yellow font-bold">{formatTime(elapsed)}</span>!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
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
