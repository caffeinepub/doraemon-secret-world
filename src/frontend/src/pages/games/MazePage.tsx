import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import GlassPanel from "../../components/GlassPanel";

const ROWS = 11;
const COLS = 11;

type WallSide = "top" | "right" | "bottom" | "left";

interface Cell {
  visited: boolean;
  walls: Record<WallSide, boolean>;
}

type MoveMap = Record<
  string,
  { dr: number; dc: number; wall: WallSide; opposite: WallSide }
>;

function generateMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    })),
  );

  const moves: MoveMap = {
    ArrowUp: { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    ArrowDown: { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    ArrowLeft: { dr: 0, dc: -1, wall: "left", opposite: "right" },
    ArrowRight: { dr: 0, dc: 1, wall: "right", opposite: "left" },
  };

  const stack: [number, number][] = [];
  let cr = 0;
  let cc = 0;
  grid[cr][cc].visited = true;
  stack.push([cr, cc]);

  while (stack.length > 0) {
    const neighbors: {
      dr: number;
      dc: number;
      wall: WallSide;
      opposite: WallSide;
    }[] = [];
    for (const move of Object.values(moves)) {
      const nr = cr + move.dr;
      const nc = cc + move.dc;
      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !grid[nr][nc].visited
      ) {
        neighbors.push(move);
      }
    }

    if (neighbors.length > 0) {
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      const nr = cr + chosen.dr;
      const nc = cc + chosen.dc;
      grid[cr][cc].walls[chosen.wall] = false;
      grid[nr][nc].walls[chosen.opposite] = false;
      grid[nr][nc].visited = true;
      stack.push([cr, cc]);
      cr = nr;
      cc = nc;
    } else {
      const prev = stack.pop()!;
      cr = prev[0];
      cc = prev[1];
    }
  }

  return grid;
}

export default function MazePage() {
  const navigate = useNavigate();
  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze());
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const moveMap: MoveMap = {
    ArrowUp: { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    ArrowDown: { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    ArrowLeft: { dr: 0, dc: -1, wall: "left", opposite: "right" },
    ArrowRight: { dr: 0, dc: 1, wall: "right", opposite: "left" },
    w: { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    s: { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    a: { dr: 0, dc: -1, wall: "left", opposite: "right" },
    d: { dr: 0, dc: 1, wall: "right", opposite: "left" },
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (won) return;
      const move = moveMap[e.key];
      if (!move) return;
      e.preventDefault();
      const [r, c] = playerPos;
      if (!maze[r][c].walls[move.wall]) {
        const nr = r + move.dr;
        const nc = c + move.dc;
        setPlayerPos([nr, nc]);
        setMoves((m) => m + 1);
        if (nr === ROWS - 1 && nc === COLS - 1) setWon(true);
      }
    },
    [playerPos, maze, won],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos([0, 0]);
    setWon(false);
    setMoves(0);
  };

  const cellSize = 28;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/games" })}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Games
        </Button>
        <h1
          className="font-display text-2xl font-bold text-white"
          style={{ textShadow: "0 0 15px #00d4ff, 0 0 30px #0099ff" }}
        >
          🌀 Doraemon Maze
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/50 text-sm">Moves: {moves}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetGame}
            className="text-white/60 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {won && (
        <GlassPanel glow="yellow" className="p-6 mb-6 text-center">
          <Trophy className="w-10 h-10 text-doraemon-yellow mx-auto mb-2" />
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            You escaped the maze!
          </h2>
          <p className="text-white/60 mb-4">Completed in {moves} moves</p>
          <Button
            onClick={resetGame}
            className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Maze
          </Button>
        </GlassPanel>
      )}

      <GlassPanel glow="cyan" className="p-4 overflow-auto">
        <div
          className="relative mx-auto"
          style={{ width: COLS * cellSize, height: ROWS * cellSize }}
        >
          {maze.flatMap((row, r) =>
            row.map((cell, c) => (
              <div
                key={`cell-${r * COLS + c}`}
                className="absolute"
                style={{
                  left: c * cellSize,
                  top: r * cellSize,
                  width: cellSize,
                  height: cellSize,
                  borderTop: cell.walls.top
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "none",
                  borderRight: cell.walls.right
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "none",
                  borderBottom: cell.walls.bottom
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "none",
                  borderLeft: cell.walls.left
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "none",
                  backgroundColor:
                    r === ROWS - 1 && c === COLS - 1
                      ? "rgba(255,220,0,0.2)"
                      : "transparent",
                }}
              >
                {r === playerPos[0] && c === playerPos[1] && (
                  <div className="absolute inset-0 flex items-center justify-center text-base">
                    🤖
                  </div>
                )}
                {r === ROWS - 1 &&
                  c === COLS - 1 &&
                  !(r === playerPos[0] && c === playerPos[1]) && (
                    <div className="absolute inset-0 flex items-center justify-center text-base">
                      🎯
                    </div>
                  )}
              </div>
            )),
          )}
        </div>
      </GlassPanel>

      <p className="text-center text-white/40 text-sm mt-4">
        Use Arrow Keys or WASD to navigate • Reach 🎯 to win
      </p>
    </div>
  );
}
