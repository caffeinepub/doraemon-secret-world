import React from "react";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 4}s`,
  duration: `${Math.random() * 3 + 2}s`,
}));

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 20 + 10,
  delay: `${Math.random() * 8}s`,
  duration: `${Math.random() * 6 + 6}s`,
}));

export default function StarBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-70"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationName: "twinkle",
            animationDuration: star.duration,
            animationDelay: star.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
      {BUBBLES.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full border border-white/20 bg-white/5"
          style={{
            left: bubble.left,
            bottom: "-60px",
            width: bubble.size,
            height: bubble.size,
            animationName: "floatUp",
            animationDuration: bubble.duration,
            animationDelay: bubble.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
      ))}
    </div>
  );
}
