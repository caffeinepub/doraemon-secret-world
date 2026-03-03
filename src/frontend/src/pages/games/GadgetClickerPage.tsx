import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, RotateCcw, Target, Zap } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GlassPanel from "../../components/GlassPanel";

const GADGETS = [
  "🔦",
  "🚪",
  "🔮",
  "⚡",
  "🎩",
  "🌀",
  "🔑",
  "💡",
  "🎯",
  "🌟",
  "🎪",
  "🔭",
];
const GAME_DURATION = 30;

interface Gadget {
  id: number;
  emoji: string;
  x: number;
  y: number;
  clicked: boolean;
}

export default function GadgetClickerPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const gadgetIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback(() => {
    setGameState("over");
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, []);

  const startGame = () => {
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setGadgets([]);
    gadgetIdRef.current = 0;
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
      const id = gadgetIdRef.current++;
      const newGadget: Gadget = {
        id,
        emoji: GADGETS[Math.floor(Math.random() * GADGETS.length)],
        x: Math.random() * 80 + 5,
        y: Math.random() * 70 + 10,
        clicked: false,
      };
      setGadgets((prev) => [...prev, newGadget]);

      // Remove after 1.5s if not clicked
      setTimeout(() => {
        setGadgets((prev) => {
          const gadget = prev.find((g) => g.id === id);
          if (gadget && !gadget.clicked) {
            setMissed((m) => m + 1);
          }
          return prev.filter((g) => g.id !== id);
        });
      }, 1500);
    }, 700);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, endGame]);

  const handleGadgetClick = (id: number) => {
    setGadgets((prev) =>
      prev.map((g) => (g.id === id ? { ...g, clicked: true } : g)),
    );
    setScore((s) => s + 1);
    setTimeout(() => {
      setGadgets((prev) => prev.filter((g) => g.id !== id));
    }, 200);
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
          ⚡ Gadget Clicker
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
          <Target className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{missed}</p>
          <p className="text-white/40 text-xs">Missed</p>
        </GlassPanel>
      </div>

      {/* Game Area */}
      <GlassPanel
        glow="blue"
        className="relative overflow-hidden"
        style={{ height: "400px" }}
      >
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="text-6xl">⚡</div>
            <h2 className="font-display text-2xl font-bold text-white">
              Gadget Clicker
            </h2>
            <p className="text-white/60 text-center px-8">
              Click the gadgets as they appear! You have {GAME_DURATION}{" "}
              seconds.
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
          <>
            {gadgets.map((gadget) => (
              <button
                type="button"
                key={gadget.id}
                onClick={() => handleGadgetClick(gadget.id)}
                className={`absolute text-3xl transition-all duration-200 hover:scale-125 cursor-pointer select-none ${
                  gadget.clicked
                    ? "scale-150 opacity-0"
                    : "scale-100 opacity-100"
                }`}
                style={{
                  left: `${gadget.x}%`,
                  top: `${gadget.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {gadget.emoji}
              </button>
            ))}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/40 rounded-full px-4 py-1 text-white/70 text-sm">
              Click the gadgets!
            </div>
          </>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
            <div className="text-5xl">🎉</div>
            <h2 className="font-display text-2xl font-bold text-white">
              Time's Up!
            </h2>
            <p className="text-white/60">You clicked {score} gadgets!</p>
            <p className="text-white/40 text-sm">Missed: {missed}</p>
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
