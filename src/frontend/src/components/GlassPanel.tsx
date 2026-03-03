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
  blue: "shadow-[0_0_30px_6px_rgba(0,160,255,0.40)] border-blue-400/60",
  red: "shadow-[0_0_30px_6px_rgba(255,60,60,0.35)] border-red-400/55",
  yellow: "shadow-[0_0_30px_6px_rgba(255,210,0,0.35)] border-yellow-400/55",
  cyan: "shadow-[0_0_30px_6px_rgba(0,220,255,0.40)] border-cyan-300/60",
  none: "border-white/15",
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
        "rounded-2xl border backdrop-blur-md",
        "bg-[oklch(0.10_0.08_250/0.80)]",
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
