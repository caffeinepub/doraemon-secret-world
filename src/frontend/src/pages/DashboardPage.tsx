import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Gamepad2,
  Heart,
  Image,
  MessageCircle,
  Quote,
  Star,
} from "lucide-react";
import React, { useEffect } from "react";
import GlassPanel from "../components/GlassPanel";
import { useBGM } from "../hooks/useBGM";
import { useHelloSound } from "../hooks/useHelloSound";

const portals = [
  {
    path: "/games",
    label: "Games Hub",
    icon: Gamepad2,
    description: "Play Doraemon-themed mini-games!",
    glow: "blue" as const,
    emoji: "🎮",
  },
  {
    path: "/chat",
    label: "Chat with Nobita",
    icon: MessageCircle,
    description: "Have a conversation with Nobita bot",
    glow: "yellow" as const,
    emoji: "💬",
  },
  {
    path: "/memories",
    label: "Memories",
    icon: BookOpen,
    description: "Store and revisit precious memories",
    glow: "cyan" as const,
    emoji: "📖",
  },
  {
    path: "/quotes",
    label: "Quotes & Facts",
    icon: Quote,
    description: "Inspiring quotes and fun facts",
    glow: "red" as const,
    emoji: "✨",
  },
  {
    path: "/friendship",
    label: "Friendship",
    icon: Heart,
    description: "The bond of Nobita & Doraemon",
    glow: "red" as const,
    emoji: "❤️",
  },
  {
    path: "/our-memories",
    label: "Our Memories",
    icon: Image,
    description: "Photo gallery of our moments",
    glow: "cyan" as const,
    emoji: "📸",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { play, pause } = useBGM();
  const { playHello } = useHelloSound();

  useEffect(() => {
    play();
    return () => {
      pause();
    };
  }, [play, pause]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <button
          type="button"
          onClick={playHello}
          className="inline-block hover:scale-105 transition-transform duration-300 cursor-pointer"
          aria-label="Click Doraemon to hear Hello"
        >
          <img
            src="/assets/generated/doraemon-hero.dim_400x400.png"
            alt="Doraemon"
            className="w-48 h-48 object-contain mx-auto drop-shadow-2xl"
          />
        </button>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-4 mb-2">
          Welcome to Doraemon's World! 🌟
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          A magical place filled with gadgets, memories, and friendship
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {["s1", "s2", "s3", "s4", "s5"].map((id) => (
            <Star
              key={id}
              className="w-4 h-4 text-doraemon-yellow fill-doraemon-yellow"
            />
          ))}
        </div>
      </div>

      {/* Portal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map(
          ({ path, label, icon: Icon, description, glow, emoji }) => (
            <GlassPanel
              key={path}
              glow={glow}
              hover
              onClick={() => navigate({ to: path })}
              className="p-6 flex flex-col items-center text-center gap-3"
            >
              <div className="text-4xl">{emoji}</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                {label}
              </h2>
              <p className="text-white/60 text-sm">{description}</p>
            </GlassPanel>
          ),
        )}
      </div>
    </div>
  );
}
