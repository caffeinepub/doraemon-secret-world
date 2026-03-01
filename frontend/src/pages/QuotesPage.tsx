import { useState, useEffect } from 'react';
import { RefreshCw, Star, Lightbulb } from 'lucide-react';
import { useGetRandomQuote, useGetRandomFunFact } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import GlassPanel from '../components/GlassPanel';

function QuoteCard({ text, author, visible }: { text: string; author: string; visible: boolean }) {
  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="text-6xl text-dora-blue-light/30 font-orbitron leading-none mb-4">"</div>
      <p className="font-nunito text-xl md:text-2xl text-foreground/90 leading-relaxed italic mb-6">
        {text}
      </p>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-dora-blue/30" />
        <span className="text-dora-blue-light font-space font-medium text-sm">— {author}</span>
        <div className="h-px flex-1 bg-dora-blue/30" />
      </div>
    </div>
  );
}

function FactCard({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-dora-yellow/20 border border-dora-yellow/40 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
          <Lightbulb size={20} className="text-dora-yellow" />
        </div>
        <p className="font-nunito text-lg md:text-xl text-foreground/90 leading-relaxed pt-2">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const queryClient = useQueryClient();
  const { data: quote, isLoading: quoteLoading } = useGetRandomQuote();
  const { data: fact, isLoading: factLoading } = useGetRandomFunFact();
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [factVisible, setFactVisible] = useState(true);

  // Auto-refresh both quote and fun fact on every page mount / refresh
  useEffect(() => {
    setQuoteVisible(false);
    setFactVisible(false);
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['random-quote'] });
      queryClient.refetchQueries({ queryKey: ['random-quote'] });
      queryClient.invalidateQueries({ queryKey: ['random-fact'] });
      queryClient.refetchQueries({ queryKey: ['random-fact'] });
      setQuoteVisible(true);
      setFactVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshQuote = () => {
    setQuoteVisible(false);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['random-quote'] });
      queryClient.refetchQueries({ queryKey: ['random-quote'] });
      setQuoteVisible(true);
    }, 300);
  };

  const refreshFact = () => {
    setFactVisible(false);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['random-fact'] });
      queryClient.refetchQueries({ queryKey: ['random-fact'] });
      setFactVisible(true);
    }, 300);
  };

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/doraemon-hero.dim_400x400.png"
              alt="Doraemon"
              className="w-24 h-24 object-contain animate-float"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold gradient-text-blue mb-3">
            Quotes & Fun Facts
          </h1>
          <p className="text-foreground/60 font-nunito text-lg">
            Wisdom from the 22nd century & amazing Doraemon facts ⭐
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quotes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-dora-blue/20 border border-dora-blue/40 flex items-center justify-center">
                <Star size={18} className="text-dora-blue-light fill-dora-blue-light" />
              </div>
              <h2 className="font-orbitron text-xl font-bold text-dora-blue-light">
                Doraemon Quotes
              </h2>
            </div>

            <GlassPanel glowColor="blue" className="p-8 flex flex-col justify-between" style={{ minHeight: '280px' }}>
              {quoteLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-dora-blue/30 border-t-dora-blue rounded-full animate-spin" />
                </div>
              ) : quote ? (
                <QuoteCard text={quote.text} author={quote.author} visible={quoteVisible} />
              ) : (
                <div className="text-center text-foreground/50 font-nunito py-8">
                  No quotes available yet. Check back soon! 💙
                </div>
              )}

              <button
                onClick={refreshQuote}
                className="mt-6 flex items-center gap-2 text-dora-blue-light/60 hover:text-dora-blue-light transition-colors text-sm font-space group"
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>New Quote</span>
              </button>
            </GlassPanel>
          </div>

          {/* Fun Facts Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-dora-yellow/20 border border-dora-yellow/40 flex items-center justify-center">
                <Lightbulb size={18} className="text-dora-yellow" />
              </div>
              <h2 className="font-orbitron text-xl font-bold text-dora-yellow">
                Fun Facts
              </h2>
            </div>

            <GlassPanel glowColor="yellow" className="p-8 flex flex-col justify-between" style={{ minHeight: '280px' }}>
              {factLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-dora-yellow/30 border-t-dora-yellow rounded-full animate-spin" />
                </div>
              ) : fact ? (
                <FactCard text={fact} visible={factVisible} />
              ) : (
                <div className="text-center text-foreground/50 font-nunito py-8">
                  No fun facts available yet. Check back soon! ⭐
                </div>
              )}

              <button
                onClick={refreshFact}
                className="mt-6 flex items-center gap-2 text-dora-yellow/60 hover:text-dora-yellow transition-colors text-sm font-space group"
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>New Fact</span>
              </button>
            </GlassPanel>
          </div>
        </div>

        {/* Decorative bottom section */}
        <div className="mt-12 text-center">
          <div className="glass rounded-2xl px-8 py-5 inline-block border border-dora-blue/20">
            <p className="text-foreground/60 font-nunito italic text-lg">
              "Even if you can't change the past, you can always change the future" 💙
            </p>
            <p className="text-dora-blue-light text-sm font-space mt-1">— Doraemon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
