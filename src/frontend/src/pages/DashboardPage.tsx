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
import React, { useEffect, useRef } from "react";

import heroImage from "/assets/uploads/IMG_20260304_131301-1.jpg";
import GlassPanel from "../components/GlassPanel";
import { useBGM } from "../hooks/useBGM";

const portals = [
  {
    path: "/games",
    label: "Games Hub",
    icon: Gamepad2,
    description: "Play Doraemon-themed mini-games!",
    glow: "blue" as const,
    emoji: "🎮",
    premium: false,
  },
  {
    path: "/chat",
    label: "Chat with Nobita",
    icon: MessageCircle,
    description: "Have a conversation with Nobita bot",
    glow: "none" as const,
    emoji: "💬",
    premium: true,
    cardStyle: {
      background:
        "linear-gradient(135deg, rgba(6,12,38,0.96) 0%, rgba(2,6,20,0.99) 100%)",
      border: "1px solid rgba(0,200,255,0.45)",
      boxShadow:
        "0 0 20px rgba(0,180,255,0.2), inset 0 1px 0 rgba(0,200,255,0.15), 0 4px 30px rgba(0,0,0,0.6)",
      borderRadius: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
    },
    iconClass: "text-cyan-400",
    labelStyle: { textShadow: "0 0 10px rgba(0,200,255,0.6)" },
  },
  {
    path: "/memories",
    label: "Memories",
    icon: BookOpen,
    description: "Store and revisit precious memories",
    glow: "none" as const,
    emoji: "📖",
    premium: true,
    cardStyle: {
      background:
        "linear-gradient(135deg, rgba(6,12,38,0.96) 0%, rgba(2,6,20,0.99) 100%)",
      border: "1px solid rgba(0,200,255,0.45)",
      boxShadow:
        "0 0 20px rgba(0,180,255,0.2), inset 0 1px 0 rgba(0,200,255,0.15), 0 4px 30px rgba(0,0,0,0.6)",
      borderRadius: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
    },
    iconClass: "text-cyan-400",
    labelStyle: { textShadow: "0 0 10px rgba(0,200,255,0.6)" },
  },
  {
    path: "/quotes",
    label: "Quotes & Facts",
    icon: Quote,
    description: "Inspiring quotes and fun facts",
    glow: "none" as const,
    emoji: "✨",
    premium: true,
    cardStyle: {
      background:
        "linear-gradient(135deg, rgba(6,12,38,0.96) 0%, rgba(2,6,20,0.99) 100%)",
      border: "1px solid rgba(255,200,50,0.45)",
      boxShadow:
        "0 0 20px rgba(255,180,30,0.2), inset 0 1px 0 rgba(255,200,50,0.15), 0 4px 30px rgba(0,0,0,0.6)",
      borderRadius: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
    },
    iconClass: "text-yellow-300",
    labelStyle: { textShadow: "0 0 10px rgba(255,200,50,0.6)" },
  },
  {
    path: "/friendship",
    label: "Friendship",
    icon: Heart,
    description: "The bond of Nobita & Doraemon",
    glow: "none" as const,
    emoji: "❤️",
    premium: true,
    cardStyle: {
      background:
        "linear-gradient(135deg, rgba(6,12,38,0.96) 0%, rgba(2,6,20,0.99) 100%)",
      border: "1px solid rgba(255,80,100,0.45)",
      boxShadow:
        "0 0 20px rgba(255,60,80,0.2), inset 0 1px 0 rgba(255,80,100,0.15), 0 4px 30px rgba(0,0,0,0.6)",
      borderRadius: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
    },
    iconClass: "text-rose-400",
    labelStyle: { textShadow: "0 0 10px rgba(255,80,100,0.6)" },
  },
  {
    path: "/our-memories",
    label: "Our Memories",
    icon: Image,
    description: "Photo gallery of our moments",
    glow: "none" as const,
    emoji: "📸",
    premium: true,
    cardStyle: {
      background:
        "linear-gradient(135deg, rgba(6,12,38,0.96) 0%, rgba(2,6,20,0.99) 100%)",
      border: "1px solid rgba(180,100,255,0.45)",
      boxShadow:
        "0 0 20px rgba(160,80,255,0.2), inset 0 1px 0 rgba(180,100,255,0.15), 0 4px 30px rgba(0,0,0,0.6)",
      borderRadius: "1rem",
      backdropFilter: "blur(20px) saturate(180%)",
    },
    iconClass: "text-purple-400",
    labelStyle: { textShadow: "0 0 10px rgba(180,100,255,0.6)" },
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { play, pause } = useBGM();
  const entrySoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    play();

    // Play Dreamy sound once on home page entry
    const entryAudio = new Audio("/assets/Dreamy.mp3.m4a");
    entryAudio.volume = 0.7;
    entrySoundRef.current = entryAudio;

    const tryPlay = () => {
      entryAudio.play().catch(() => {});
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };

    entryAudio.play().catch(() => {
      document.addEventListener("click", tryPlay, true);
      document.addEventListener("touchstart", tryPlay, true);
    });

    return () => {
      pause();
      entryAudio.pause();
      entryAudio.src = "";
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };
  }, [play, pause]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img
            src={heroImage}
            alt="Doraemon and Nobita watching Earth from the Moon"
            className="rounded-2xl max-w-xs w-full"
            style={{
              boxShadow: "0 0 30px #00d4ff, 0 0 60px rgba(0,180,255,0.3)",
              border: "2px solid rgba(0,212,255,0.4)",
            }}
          />
        </div>
        <h1
          className="font-display text-4xl md:text-5xl font-bold text-white mt-4 mb-2"
          style={{
            textShadow:
              "0 0 20px #00d4ff, 0 0 40px #0099ff, 0 0 70px rgba(0,120,255,0.5)",
          }}
        >
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
          ({
            path,
            label,
            icon: Icon,
            description,
            glow,
            emoji,
            premium,
            cardStyle,
            iconClass,
            labelStyle,
          }) => (
            <GlassPanel
              key={path}
              glow={glow}
              hover
              onClick={() => navigate({ to: path })}
              className="p-6 flex flex-col items-center text-center gap-3"
              style={premium && cardStyle ? cardStyle : undefined}
            >
              <div className="text-4xl">{emoji}</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon
                  className={`w-6 h-6 ${premium && iconClass ? iconClass : "text-white"}`}
                />
              </div>
              <h2
                className="font-display text-xl font-bold text-white"
                style={premium && labelStyle ? labelStyle : undefined}
              >
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
