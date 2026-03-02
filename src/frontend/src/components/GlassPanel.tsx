import { cn } from "@/lib/utils";
import type React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "red" | "yellow" | "cyan" | "none";
  float?: boolean;
  hover?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const glowClasses = {
  blue: "shadow-[0_0_24px_4px_rgba(0,180,255,0.25)] border-blue-400/40",
  red: "shadow-[0_0_24px_4px_rgba(255,60,60,0.25)] border-red-400/40",
  yellow: "shadow-[0_0_24px_4px_rgba(255,220,0,0.25)] border-yellow-400/40",
  cyan: "shadow-[0_0_24px_4px_rgba(0,255,220,0.25)] border-cyan-400/40",
  none: "border-white/10",
};

export default function GlassPanel({
  children,
  className,
  glow = "none",
  float = false,
  hover = false,
  style,
  onClick,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/10 backdrop-blur-md",
        glowClasses[glow],
        float && "animate-float",
        hover &&
          "transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        className,
      )}
      style={style}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
