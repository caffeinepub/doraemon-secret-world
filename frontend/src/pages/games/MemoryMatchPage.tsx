import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import GlassPanel from '../../components/GlassPanel';

const CARD_EMOJIS = ['🔵', '⭐', '💙', '🎁', '🌟', '🤝', '✨', '💫', '🎀', '🌸', '🎊', '🏆'];

interface CardItem {
  id: number;
  emoji: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

function createCards(): CardItem[] {
  const pairs: CardItem[] = CARD_EMOJIS.flatMap((emoji, i) => [
    { id: i * 2, emoji, pairId: i, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false },
  ]);

  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function MemoryMatchPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardItem[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [won, startTime]);

  const handleCardClick = useCallback((cardId: number) => {
    if (locked || won) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.includes(cardId)) return;

    const newFlipped = [...flippedIds, cardId];

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const [id1, id2] = newFlipped;
      const c1 = cards.find((c) => c.id === id1);
      const c2 = cards.find((c) => c.id === id2);

      if (c1 && c2 && c1.pairId === c2.pairId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, matched: true } : c
            )
          );
          const newMatches = matches + 1;
          setMatches(newMatches);
          setFlippedIds([]);
          setLocked(false);
          if (newMatches === CARD_EMOJIS.length) {
            setWon(true);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c
            )
          );
          setFlippedIds([]);
          setLocked(false);
        }, 1000);
      }
    } else {
      setFlippedIds(newFlipped);
    }
  }, [cards, flippedIds, locked, won, matches]);

  const handleReset = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setWon(false);
    setLocked(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: '/games' })}
            className="w-10 h-10 rounded-full glass border border-dora-red/30 flex items-center justify-center text-foreground/60 hover:text-dora-red transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-dora-red">Memory Match</h1>
            <p className="text-foreground/50 text-sm font-space">Find all the matching pairs! 🃏</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <GlassPanel glowColor="red" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">MOVES</p>
            <p className="font-orbitron text-xl font-bold text-dora-red">{moves}</p>
          </GlassPanel>
          <GlassPanel glowColor="blue" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">MATCHES</p>
            <p className="font-orbitron text-xl font-bold text-dora-blue-light">
              {matches}/{CARD_EMOJIS.length}
            </p>
          </GlassPanel>
          <GlassPanel glowColor="yellow" className="p-3 text-center">
            <p className="text-foreground/50 text-xs font-space mb-1">TIME</p>
            <p className="font-orbitron text-xl font-bold text-dora-yellow">{formatTime(elapsed)}</p>
          </GlassPanel>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-square perspective-1000 cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`memory-card-inner w-full h-full ${
                  card.flipped || card.matched ? 'flipped' : ''
                }`}
              >
                {/* Card Back */}
                <div
                  className="memory-card-front border-2 border-dora-blue/40"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.55 0.22 240 / 0.3), oklch(0.18 0.12 250 / 0.5))',
                    boxShadow: '0 0 8px oklch(0.55 0.22 240 / 0.3)',
                  }}
                >
                  <img
                    src="/assets/generated/memory-card-face.dim_200x200.png"
                    alt="card back"
                    className="w-full h-full object-cover rounded-xl opacity-80"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      if (el.parentElement) {
                        el.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem">🔵</div>';
                      }
                    }}
                  />
                </div>

                {/* Card Front */}
                <div
                  className="memory-card-back flex items-center justify-center text-3xl sm:text-4xl border-2"
                  style={{
                    background: card.matched
                      ? 'linear-gradient(135deg, oklch(0.88 0.18 85 / 0.3), oklch(0.88 0.18 85 / 0.1))'
                      : 'linear-gradient(135deg, oklch(0.55 0.22 240 / 0.2), oklch(0.18 0.12 250 / 0.4))',
                    borderColor: card.matched
                      ? 'oklch(0.88 0.18 85 / 0.6)'
                      : 'oklch(0.55 0.22 240 / 0.5)',
                    boxShadow: card.matched
                      ? '0 0 12px oklch(0.88 0.18 85 / 0.5)'
                      : '0 0 8px oklch(0.55 0.22 240 / 0.3)',
                  }}
                >
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="dora-btn dora-btn-red w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          New Game
        </button>

        {/* Win Modal */}
        {won && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <GlassPanel glowColor="yellow" className="p-8 text-center max-w-sm mx-4 animate-bounce-in">
              <div className="text-6xl mb-4">🎊</div>
              <Trophy className="text-dora-yellow mx-auto mb-3" size={32} />
              <h2 className="font-orbitron text-2xl font-bold text-dora-yellow mb-2">
                All Pairs Found!
              </h2>
              <p className="text-foreground/70 font-nunito mb-4">
                Incredible memory! You matched all pairs in{' '}
                <span className="text-dora-blue-light font-bold">{moves} moves</span>{' '}
                and{' '}
                <span className="text-dora-yellow font-bold">{formatTime(elapsed)}</span>!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="dora-btn dora-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Play Again
                </button>
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="dora-btn dora-btn-yellow flex-1"
                >
                  Games Hub
                </button>
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
