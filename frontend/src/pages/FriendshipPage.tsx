import { useRef, useEffect, useState } from 'react';
import GlassPanel from '../components/GlassPanel';

const FRIENDSHIP_PANELS = [
  {
    quote: "Doraemon always appears when Nobita needs him most — not because he has to, but because he wants to. That's what true friendship looks like.",
    author: 'The Story of Doraemon',
    emoji: '🔵',
    color: 'blue' as const,
  },
  {
    quote: "Nobita may not be the smartest or the strongest, but he has the biggest heart. And Doraemon loves him exactly as he is.",
    author: 'Fujiko F. Fujio',
    emoji: '💙',
    color: 'red' as const,
  },
  {
    quote: "They argue, they laugh, they cry together. But at the end of every episode, they're still side by side. That's the magic of their bond.",
    author: 'Doraemon Series',
    emoji: '🤝',
    color: 'yellow' as const,
  },
  {
    quote: "Doraemon came from the future to change Nobita's life. But in the end, Nobita changed Doraemon's heart too.",
    author: 'The Greatest Friendship',
    emoji: '⏰',
    color: 'cyan' as const,
  },
  {
    quote: "Every gadget Doraemon pulls out is an act of love. He doesn't just solve problems — he believes in Nobita when no one else does.",
    author: "Doraemon's Pocket",
    emoji: '🎁',
    color: 'blue' as const,
  },
  {
    quote: "Just like Nobita and Doraemon, the best friendships are the ones where you can be completely yourself — flaws and all.",
    author: 'A Lesson from DoraLand',
    emoji: '🌟',
    color: 'red' as const,
  },
];

function FriendshipPanel({ panel, index }: { panel: typeof FRIENDSHIP_PANELS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible
          ? 'opacity-100 translate-x-0'
          : isLeft
          ? 'opacity-0 -translate-x-16'
          : 'opacity-0 translate-x-16'
      }`}
    >
      <GlassPanel glowColor={panel.color} className="p-6 comic-panel">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
            {panel.emoji}
          </div>
          <div>
            <blockquote className="font-nunito text-lg text-foreground/90 leading-relaxed italic mb-3">
              "{panel.quote}"
            </blockquote>
            <cite className="text-foreground/50 text-sm font-space not-italic">
              — {panel.author}
            </cite>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

export default function FriendshipPage() {
  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-dora-blue/30 glow-blue max-w-lg w-full">
              <img
                src="/assets/generated/nobita-doraemon-friends.dim_800x500.png"
                alt="Nobita and Doraemon"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  if (el.parentElement) {
                    el.parentElement.innerHTML = `
                      <div style="width:100%;height:16rem;display:flex;align-items:center;justify-content:center;background:oklch(0.55 0.22 240 / 0.1)">
                        <div style="text-align:center">
                          <div style="font-size:5rem;margin-bottom:1rem">🤝</div>
                          <p style="color:oklch(0.65 0.06 240)">Nobita & Doraemon</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="font-orbitron text-sm text-dora-blue-light font-bold tracking-wider">
                  THE GREATEST FRIENDSHIP
                </span>
              </div>
            </div>
          </div>

          <h1 className="font-orbitron text-3xl md:text-4xl font-bold gradient-text-blue mb-3">
            Nobita & Doraemon
          </h1>
          <p className="text-foreground/60 font-nunito text-lg max-w-xl mx-auto">
            A friendship that transcends time, space, and every obstacle in between 💙
          </p>
        </div>

        {/* Story intro */}
        <GlassPanel glowColor="blue" className="p-8 mb-8 text-center">
          <p className="font-nunito text-xl text-foreground/80 leading-relaxed">
            In 1969, Fujiko F. Fujio gave the world a story about a boy and his robot cat from the future.
            But what they really gave us was a lesson about{' '}
            <span className="text-dora-blue-light font-bold">unconditional friendship</span>,{' '}
            <span className="text-dora-red font-bold">believing in someone</span>, and{' '}
            <span className="text-dora-yellow font-bold">never giving up</span>.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            {['🔵', '💙', '⭐', '💙', '🔵'].map((e, i) => (
              <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {e}
              </span>
            ))}
          </div>
        </GlassPanel>

        {/* Friendship panels */}
        <div className="space-y-6 mb-10">
          {FRIENDSHIP_PANELS.map((panel, i) => (
            <FriendshipPanel key={i} panel={panel} index={i} />
          ))}
        </div>

        {/* Our friendship section */}
        <GlassPanel glowColor="red" className="p-8 text-center">
          <div className="text-5xl mb-4 animate-float">💙</div>
          <h2 className="font-orbitron text-2xl font-bold text-dora-red mb-4">
            Just Like Them, We Have Our Story
          </h2>
          <p className="font-nunito text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            Every great friendship has its own magic. Ours is no different.
            Like Nobita and Doraemon, we found each other at exactly the right moment,
            and everything changed. This world was built to celebrate that — our bond,
            our memories, our adventures together. 🌟
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {['💙', '🤝', '⭐', '🤝', '💙'].map((e, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                {e}
              </span>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
