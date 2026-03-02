import { useNavigate } from "@tanstack/react-router";
import { Brain, Clock, Grid, Layers, Target, Trophy, Zap } from "lucide-react";
import React from "react";
import GlassPanel from "../components/GlassPanel";

const games = [
  {
    path: "/games/exam-quiz",
    title: "Nobita's Exam Quiz",
    description:
      "Answer 10 Doraemon trivia questions. Can you beat Nobita's legendary 0?",
    icon: Brain,
    emoji: "📝",
    glow: "yellow" as const,
    howTo:
      "Choose the correct answer from 4 options. Score as high as you can!",
  },
  {
    path: "/games/gadget-clicker",
    title: "Gadget Clicker",
    description:
      "Click on Doraemon's gadgets as they appear before time runs out!",
    icon: Zap,
    emoji: "⚡",
    glow: "blue" as const,
    howTo: "Click the gadget emojis that pop up within 30 seconds.",
  },
  {
    path: "/games/maze",
    title: "Doraemon Maze",
    description: "Navigate through the maze to find Doraemon's pocket!",
    icon: Grid,
    emoji: "🌀",
    glow: "cyan" as const,
    howTo: "Use arrow keys or WASD to move through the maze to the exit.",
  },
  {
    path: "/games/memory-match",
    title: "Memory Match",
    description: "Match pairs of Doraemon character cards!",
    icon: Layers,
    emoji: "🃏",
    glow: "red" as const,
    howTo: "Flip cards to find matching pairs. Match all pairs to win!",
  },
  {
    path: "/games/sliding-puzzle",
    title: "Sliding Puzzle",
    description: "Rearrange the tiles to complete the Doraemon picture!",
    icon: Grid,
    emoji: "🧩",
    glow: "yellow" as const,
    howTo: "Click tiles adjacent to the empty space to slide them into order.",
  },
  {
    path: "/games/whack-a-doraemon",
    title: "Whack-a-Doraemon",
    description: "Whack Doraemon characters as they pop up from their holes!",
    icon: Target,
    emoji: "🔨",
    glow: "blue" as const,
    howTo: "Click characters when they appear. Build combos for bonus points!",
  },
];

export default function GamesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          🎮 Games Hub
        </h1>
        <p className="text-white/60 text-lg">
          Choose your adventure in Doraemon's world!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(
          ({ path, title, description, icon: Icon, emoji, glow, howTo }) => (
            <GlassPanel
              key={path}
              glow={glow}
              hover
              onClick={() => navigate({ to: path })}
              className="p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{emoji}</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                {title}
              </h2>
              <p className="text-white/60 text-sm flex-1">{description}</p>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/40 text-xs">
                  <Trophy className="w-3 h-3 inline mr-1" />
                  {howTo}
                </p>
              </div>
            </GlassPanel>
          ),
        )}
      </div>
    </div>
  );
}
