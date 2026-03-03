import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import React, { useState, useCallback } from "react";
import GlassPanel from "../../components/GlassPanel";

const SIZE = 3;
const SOLVED = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1).concat([
  0,
]);

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Ensure solvable
  const inversions = a.reduce((count, val, i) => {
    if (val === 0) return count;
    let extra = 0;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] !== 0 && a[j] < val) extra += 1;
    }
    return count + extra;
  }, 0);
  if (inversions % 2 !== 0) {
    // Swap first two non-zero elements to make solvable
    const i0 = a.findIndex((v) => v !== 0);
    const i1 = a.findIndex((v, i) => v !== 0 && i > i0);
    [a[i0], a[i1]] = [a[i1], a[i0]];
  }
  return a;
}

export default function SlidingPuzzlePage() {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<number[]>(() => shuffle([...SOLVED]));
  const [moves, setMoves] = useState(0);

  const isSolved = tiles.join(",") === SOLVED.join(",");

  const handleTileClick = useCallback(
    (index: number) => {
      if (isSolved) return;
      const emptyIndex = tiles.indexOf(0);
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const emptyRow = Math.floor(emptyIndex / SIZE);
      const emptyCol = emptyIndex % SIZE;

      const isAdjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

      if (isAdjacent) {
        const newTiles = [...tiles];
        [newTiles[index], newTiles[emptyIndex]] = [
          newTiles[emptyIndex],
          newTiles[index],
        ];
        setTiles(newTiles);
        setMoves((m) => m + 1);
      }
    },
    [tiles, isSolved],
  );

  const resetGame = () => {
    setTiles(shuffle([...SOLVED]));
    setMoves(0);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
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
          🧩 Sliding Puzzle
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

      {isSolved && (
        <GlassPanel glow="yellow" className="p-6 mb-6 text-center">
          <Trophy className="w-10 h-10 text-doraemon-yellow mx-auto mb-2" />
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            Puzzle Solved!
          </h2>
          <p className="text-white/60 mb-4">Completed in {moves} moves</p>
          <Button
            onClick={resetGame}
            className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Puzzle
          </Button>
        </GlassPanel>
      )}

      <GlassPanel glow="yellow" className="p-4">
        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            maxWidth: "300px",
          }}
        >
          {tiles.map((tile, index) => (
            <button
              type="button"
              key={`tile-${tile}`}
              onClick={() => handleTileClick(index)}
              className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-150 ${
                tile === 0
                  ? "bg-transparent border-2 border-dashed border-white/20 cursor-default"
                  : "bg-doraemon-blue/40 border border-doraemon-blue/60 text-white hover:bg-doraemon-blue/60 cursor-pointer hover:scale-105"
              }`}
            >
              {tile !== 0 ? tile : ""}
            </button>
          ))}
        </div>
      </GlassPanel>

      <p className="text-center text-white/40 text-sm mt-4">
        Click tiles adjacent to the empty space to slide them
      </p>
    </div>
  );
}
