import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const COLS = 15;
const ROWS = 11;
const CELL_SIZE = 36;

type WallSide = 'top' | 'right' | 'bottom' | 'left';

type Cell = {
  row: number;
  col: number;
  walls: Record<WallSide, boolean>;
  visited: boolean;
};

type DirEntry = {
  dr: number;
  dc: number;
  w1: WallSide;
  w2: WallSide;
};

function createMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      row: r,
      col: c,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const dirs: DirEntry[] = [
    { dr: -1, dc: 0, w1: 'top', w2: 'bottom' },
    { dr: 0, dc: 1, w1: 'right', w2: 'left' },
    { dr: 1, dc: 0, w1: 'bottom', w2: 'top' },
    { dr: 0, dc: -1, w1: 'left', w2: 'right' },
  ];

  const stack: [number, number][] = [];
  let cr = 0, cc = 0;
  grid[cr][cc].visited = true;
  stack.push([cr, cc]);

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const unvisited = dirs
      .map(({ dr, dc, w1, w2 }) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !grid[nr][nc].visited) {
          return { nr, nc, w1, w2 };
        }
        return null;
      })
      .filter((x): x is { nr: number; nc: number; w1: WallSide; w2: WallSide } => x !== null);

    if (unvisited.length === 0) {
      stack.pop();
    } else {
      const { nr, nc, w1, w2 } = unvisited[Math.floor(Math.random() * unvisited.length)];
      grid[r][c].walls[w1] = false;
      grid[nr][nc].walls[w2] = false;
      grid[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
  }

  return grid;
}

type MoveMap = Record<string, { dr: number; dc: number; wall: WallSide }>;

const MOVE_MAP: MoveMap = {
  ArrowUp:    { dr: -1, dc:  0, wall: 'top' },
  ArrowDown:  { dr:  1, dc:  0, wall: 'bottom' },
  ArrowLeft:  { dr:  0, dc: -1, wall: 'left' },
  ArrowRight: { dr:  0, dc:  1, wall: 'right' },
  w:          { dr: -1, dc:  0, wall: 'top' },
  s:          { dr:  1, dc:  0, wall: 'bottom' },
  a:          { dr:  0, dc: -1, wall: 'left' },
  d:          { dr:  0, dc:  1, wall: 'right' },
};

export default function MazePage() {
  const navigate = useNavigate();
  const [maze, setMaze] = useState<Cell[][]>(() => createMaze());
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goalPos: [number, number] = [ROWS - 1, COLS - 1];

  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [won, startTime]);

  const tryMove = useCallback((dr: number, dc: number, wall: WallSide) => {
    if (won) return;
    setPlayerPos(([pr, pc]) => {
      const nr = pr + dr;
      const nc = pc + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return [pr, pc];
      if (maze[pr][pc].walls[wall]) return [pr, pc];
      setMoves((m) => m + 1);
      if (nr === goalPos[0] && nc === goalPos[1]) {
        setWon(true);
      }
      return [nr, nc];
    });
  }, [maze, won, goalPos]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const move = MOVE_MAP[e.key];
    if (!move) return;
    e.preventDefault();
    tryMove(move.dr, move.dc, move.wall);
  }, [tryMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    setMaze(createMaze());
    setPlayerPos([0, 0]);
    setMoves(0);
    setWon(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const WALL_COLOR = '#1e3a5f';
  const PATH_COLOR = 'rgba(30, 60, 120, 0.3)';

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-yellow/30 flex items-center justify-center text-foreground/60 hover:text-dora-yellow transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-yellow">Maze Adventure</h1>
            <p className="text-foreground/50 text-sm font-space">Guide Doraemon to the star! 🌟</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassPanel glowColor="yellow" className="p-4 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">MOVES</p>
            <p className="font-orbitron text-2xl font-bold text-dora-yellow">{moves}</p>
          </GlassPanel>
          <GlassPanel glowColor="blue" className="p-4 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">TIME</p>
            <p className="font-orbitron text-2xl font-bold text-dora-blue-light">{formatTime(elapsed)}</p>
          </GlassPanel>
        </div>

        {/* Maze */}
        <GlassPanel glowColor="yellow" className="p-4 mb-6 overflow-auto">
          <div
            ref={containerRef}
            className="relative mx-auto"
            style={{
              width: COLS * CELL_SIZE,
              height: ROWS * CELL_SIZE,
            }}
            tabIndex={0}
          >
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos[0] === r && playerPos[1] === c;
                const isGoal = goalPos[0] === r && goalPos[1] === c;
                const isStart = r === 0 && c === 0;

                return (
                  <div
                    key={`${r}-${c}`}
                    className="absolute"
                    style={{
                      left: c * CELL_SIZE,
                      top: r * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: PATH_COLOR,
                      borderTop: cell.walls.top ? `2px solid ${WALL_COLOR}` : 'none',
                      borderRight: cell.walls.right ? `2px solid ${WALL_COLOR}` : 'none',
                      borderBottom: cell.walls.bottom ? `2px solid ${WALL_COLOR}` : 'none',
                      borderLeft: cell.walls.left ? `2px solid ${WALL_COLOR}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: CELL_SIZE * 0.55,
                      lineHeight: 1,
                    }}
                  >
                    {isPlayer && (
                      <span style={{ filter: 'drop-shadow(0 0 6px #00aaff)' }}>🔵</span>
                    )}
                    {isGoal && !isPlayer && (
                      <span style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }}>⭐</span>
                    )}
                    {isStart && !isPlayer && (
                      <span style={{ opacity: 0.4, fontSize: CELL_SIZE * 0.4 }}>▶</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </GlassPanel>

        {/* Controls hint */}
        <div className="glass rounded-xl p-3 border border-dora-yellow/20 mb-4 text-center">
          <p className="text-foreground/40 text-xs font-space">
            ⌨️ Arrow keys or WASD to move • 🔵 = You • ⭐ = Goal
          </p>
        </div>

        {/* Touch controls */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <button
            onClick={() => tryMove(-1, 0, 'top')}
            className="w-12 h-12 rounded-xl glass border border-dora-yellow/40 flex items-center justify-center text-dora-yellow text-xl hover:bg-dora-yellow/20 transition-all active:scale-95"
          >
            ▲
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => tryMove(0, -1, 'left')}
              className="w-12 h-12 rounded-xl glass border border-dora-yellow/40 flex items-center justify-center text-dora-yellow text-xl hover:bg-dora-yellow/20 transition-all active:scale-95"
            >
              ◀
            </button>
            <button
              onClick={() => tryMove(1, 0, 'bottom')}
              className="w-12 h-12 rounded-xl glass border border-dora-yellow/40 flex items-center justify-center text-dora-yellow text-xl hover:bg-dora-yellow/20 transition-all active:scale-95"
            >
              ▼
            </button>
            <button
              onClick={() => tryMove(0, 1, 'right')}
              className="w-12 h-12 rounded-xl glass border border-dora-yellow/40 flex items-center justify-center text-dora-yellow text-xl hover:bg-dora-yellow/20 transition-all active:scale-95"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="dora-btn dora-btn-yellow w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          New Maze
        </button>

        {/* Win Modal */}
        {won && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4 animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">
                Maze Conquered!
              </h2>
              <p className="text-foreground/70 font-nunito mb-4">
                Doraemon found the star in{' '}
                <span className="text-dora-blue-light font-bold">{moves} moves</span>{' '}
                and{' '}
                <span className="text-dora-yellow font-bold">{formatTime(elapsed)}</span>!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="dora-btn dora-btn-yellow flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  New Maze
                </button>
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="dora-btn dora-btn-primary flex-1"
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
