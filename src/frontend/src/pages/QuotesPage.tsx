import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Loader2, Quote, RefreshCw } from "lucide-react";
import React, { useEffect } from "react";
import GlassPanel from "../components/GlassPanel";
import { useGetRandomFunFact, useGetRandomQuote } from "../hooks/useQueries";

export default function QuotesPage() {
  const queryClient = useQueryClient();
  const {
    data: quote,
    isLoading: quoteLoading,
    error: quoteError,
  } = useGetRandomQuote();
  const {
    data: funFact,
    isLoading: factLoading,
    error: factError,
  } = useGetRandomFunFact();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["randomQuote"] });
    queryClient.invalidateQueries({ queryKey: ["randomFunFact"] });
  }, [queryClient]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["randomQuote"] });
    queryClient.invalidateQueries({ queryKey: ["randomFunFact"] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          ✨ Quotes & Fun Facts
        </h1>
        <p className="text-white/50 text-sm">
          Wisdom from the world of Doraemon
        </p>
      </div>

      <div className="space-y-6">
        {/* Quote Section */}
        <GlassPanel glow="yellow" className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-doraemon-yellow" />
            <h2 className="font-display text-xl font-bold text-white">
              Quote of the Day
            </h2>
          </div>

          {quoteLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-doraemon-yellow animate-spin" />
            </div>
          ) : quoteError ? (
            <div className="text-center py-8">
              <p className="text-white/40 italic text-lg">
                "The future is something you create yourself."
              </p>
              <p className="text-white/30 text-sm mt-2">— Doraemon</p>
            </div>
          ) : quote ? (
            <div>
              <p className="text-white/80 italic text-xl leading-relaxed mb-4">
                "{quote.text}"
              </p>
              <p className="text-doraemon-yellow font-semibold">
                — {quote.author}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/40 italic text-lg">
                "The future is something you create yourself."
              </p>
              <p className="text-white/30 text-sm mt-2">— Doraemon</p>
            </div>
          )}
        </GlassPanel>

        {/* Fun Fact Section */}
        <GlassPanel glow="cyan" className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-doraemon-cyan" />
            <h2 className="font-display text-xl font-bold text-white">
              Fun Fact
            </h2>
          </div>

          {factLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-doraemon-cyan animate-spin" />
            </div>
          ) : factError ? (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">
                🤖 Doraemon comes from the 22nd century and has a 4-dimensional
                pocket on his belly!
              </p>
            </div>
          ) : funFact ? (
            <p className="text-white/80 text-lg leading-relaxed">
              🤖 {funFact}
            </p>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">
                🤖 Doraemon comes from the 22nd century and has a 4-dimensional
                pocket on his belly!
              </p>
            </div>
          )}
        </GlassPanel>

        <div className="text-center">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
