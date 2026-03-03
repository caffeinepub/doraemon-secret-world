import { Heart } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import nobitaDoraemonImg from "/assets/generated/nobita-doraemon-friends.dim_800x500.png";
import GlassPanel from "../components/GlassPanel";

const panels = [
  {
    emoji: "🤖",
    title: "A Robot from the Future",
    text: "Doraemon was sent from the 22nd century by Nobita's future grandson to help Nobita improve his life. What started as a mission became the greatest friendship ever told.",
    glow: "blue" as const,
  },
  {
    emoji: "😢",
    title: "A Boy Who Needed Help",
    text: "Nobita was clumsy, lazy, and always getting 0 on his tests. But beneath all that, he had the kindest heart. Doraemon saw what others couldn't — his true potential.",
    glow: "yellow" as const,
  },
  {
    emoji: "🎒",
    title: "The Magic Pocket",
    text: "From the Anywhere Door to the Small Light, Doraemon's 4-dimensional pocket held wonders beyond imagination. But the greatest gadget was always his friendship.",
    glow: "cyan" as const,
  },
  {
    emoji: "🌟",
    title: "Growing Together",
    text: "Through every adventure, every mistake, and every triumph, Nobita and Doraemon grew together. They taught us that true friendship means believing in someone even when they don't believe in themselves.",
    glow: "red" as const,
  },
  {
    emoji: "💙",
    title: "A Bond Beyond Time",
    text: "Their friendship transcends time, space, and even the boundary between human and robot. Nobita and Doraemon remind us that the most powerful force in any universe is love.",
    glow: "blue" as const,
  },
];

function FriendshipPanel({
  emoji,
  title,
  text,
  glow,
  index,
}: {
  emoji: string;
  title: string;
  text: string;
  glow: "blue" | "red" | "yellow" | "cyan" | "none";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <GlassPanel glow={glow} className="p-8">
        <div className="flex items-start gap-4">
          <div className="text-5xl shrink-0">{emoji}</div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              {title}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">{text}</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

export default function FriendshipPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <img
          src={nobitaDoraemonImg}
          alt="Nobita and Doraemon"
          className="w-full max-w-lg mx-auto rounded-2xl object-cover shadow-2xl mb-6"
        />
        <h1
          className="font-display text-4xl font-bold text-white mb-3"
          style={{
            textShadow:
              "0 0 15px #00d4ff, 0 0 30px #0099ff, 0 0 60px rgba(0,100,255,0.4)",
          }}
        >
          ❤️ The Greatest Friendship
        </h1>
        <p className="text-white/60 text-lg">
          A story of a boy and his robot cat that touched millions of hearts
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Heart className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />
          <span className="text-white/40 text-sm">
            Nobita & Doraemon Forever
          </span>
          <Heart className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        {panels.map((panel, i) => (
          <FriendshipPanel key={panel.title} {...panel} index={i} />
        ))}
      </div>
    </div>
  );
}
