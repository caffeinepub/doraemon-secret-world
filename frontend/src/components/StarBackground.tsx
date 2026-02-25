import { useMemo } from 'react';

interface StarItem {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface BubbleItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function StarBackground() {
  const stars = useMemo<StarItem[]>(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 3 + 1.5,
      delay: Math.random() * 4,
    }));
  }, []);

  const bubbles = useMemo<BubbleItem[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="stars-bg" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            left: `${bubble.x}%`,
            bottom: '-100px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            '--duration': `${bubble.duration}s`,
            '--delay': `${bubble.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
