import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'red' | 'yellow' | 'cyan' | 'none';
  animate?: boolean;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassPanel({
  children,
  className,
  glowColor = 'blue',
  animate = false,
  hover = false,
  onClick,
  style,
}: GlassPanelProps) {
  const glowClass = {
    blue: 'neon-border-blue',
    red: 'neon-border-red',
    yellow: 'neon-border-yellow',
    cyan: 'glow-cyan border border-dora-cyan/40',
    none: 'border border-white/10',
  }[glowColor];

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'glass-card rounded-2xl',
        glowClass,
        animate && 'animate-float',
        hover && 'hover-lift cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
