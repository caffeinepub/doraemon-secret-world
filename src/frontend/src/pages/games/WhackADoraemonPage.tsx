import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, RotateCcw, Star, Zap } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GlassPanel from "../../components/GlassPanel";

const CHARACTERS = ["🤖", "😺", "🎩", "⭐", "🍡"];
const GAME_DURATION = 30;
const GRID_SIZE = 9;

interface Hole {
  id: number;
  character: string | null;
  active: boolean;
}

export default function WhackADoraemonPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [holes, setHoles] = useState<Hole[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      character: null,
      active: false,
    })),
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endGame = useCallback(() => {
    setGameState("over");
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    setHoles((prev) =>
      prev.map((h) => ({ ...h, character: null, active: false })),
    );
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setHoles(
      Array.from({ length: GRID_SIZE }, (_, i) => ({
        id: i,
        character: null,
        active: false,
      })),
    );
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => {
      const holeIndex = Math.floor(Math.random() * GRID_SIZE);
      const character =
        CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

      setHoles((prev) =>
        prev.map((h) =>
          h.id === holeIndex && !h.active
            ? { ...h, character, active: true }
            : h,
        ),
      );

      setTimeout(() => {
        setHoles((prev) =>
          prev.map((h) =>
            h.id === holeIndex ? { ...h, character: null, active: false } : h,
          ),
        );
      }, 900);
    }, 600);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, endGame]);

  const handleWhack = (id: number) => {
    setHoles((prev) => {
      const hole = prev.find((h) => h.id === id);
      if (!hole || !hole.active) return prev;
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((s) => s + 1 * Math.max(1, Math.floor(newCombo / 3)));

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setCombo(0), 1500);

      return prev.map((h) =>
        h.id === id ? { ...h, character: null, active: false } : h,
      );
    });
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
        <h1 className="font-display text-2xl font-bold text-white">
          🔨 Whack-a-Doraemon
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <GlassPanel className="p-3 text-center">
          <Zap className="w-4 h-4 text-doraemon-yellow mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{score}</p>
          <p className="text-white/40 text-xs">Score</p>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <Clock className="w-4 h-4 text-doraemon-blue mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{timeLeft}s</p>
          <p className="text-white/40 text-xs">Time</p>
        </GlassPanel>
        <GlassPanel className="p-3 text-center">
          <Star className="w-4 h-4 text-doraemon-yellow mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            x{Math.max(1, Math.floor(combo / 3))}
          </p>
          <p className="text-white/40 text-xs">Combo</p>
        </GlassPanel>
      </div>

      <GlassPanel glow="blue" className="p-6">
        {gameState === "idle" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-6xl">🔨</div>
            <h2 className="font-display text-2xl font-bold text-white">
              Whack-a-Doraemon
            </h2>
            <p className="text-white/60 text-center">
              Click characters as they pop up! Build combos for bonus points!
            </p>
            <Button
              onClick={startGame}
              className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-3 gap-4">
            {holes.map((hole) => (
              <button
                type="button"
                key={hole.id}
                onClick={() => handleWhack(hole.id)}
                className="relative aspect-square rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src="/assets/generated/game-hole.dim_128x128.png"
                  alt="hole"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                {hole.active && hole.character && (
                  <span
                    className="relative z-10 text-4xl animate-bounce"
                    style={{ animationDuration: "0.3s" }}
                  >
                    {hole.character}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {gameState === "over" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-5xl">🎉</div>
            <h2 className="font-display text-2xl font-bold text-white">
              Game Over!
            </h2>
            <p className="text-white/60">Final Score: {score}</p>
            <div className="flex gap-3">
              <Button
                onClick={startGame}
                className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/games" })}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Games
              </Button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
