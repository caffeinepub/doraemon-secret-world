import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import React, { useState, useEffect } from "react";
import GlassPanel from "../../components/GlassPanel";

const EMOJIS = [
  "🤖",
  "🎩",
  "🚪",
  "🔦",
  "⭐",
  "🍡",
  "🌀",
  "🎯",
  "💙",
  "🔮",
  "⚡",
  "🎪",
];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function createCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleCardClick = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = { ...card };

      setTimeout(() => {
        if (cardA.emoji === cardB.emoji) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c,
            ),
          );
          setFlipped([]);
          setLocked(false);
        } else {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c,
            ),
          );
          setFlipped([]);
          setLocked(false);
        }
      }, 800);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWon(true);
    }
  }, [cards]);

  const resetGame = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
  };

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
          🃏 Memory Match
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
            You matched them all!
          </h2>
          <p className="text-white/60 mb-4">Completed in {moves} moves</p>
          <Button
            onClick={resetGame}
            className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </GlassPanel>
      )}

      <div className="grid grid-cols-6 gap-2">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl border text-2xl flex items-center justify-center transition-all duration-300 ${
              card.flipped || card.matched
                ? "bg-doraemon-blue/30 border-doraemon-blue/50 scale-100"
                : "bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105"
            } ${card.matched ? "opacity-60" : ""}`}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}
