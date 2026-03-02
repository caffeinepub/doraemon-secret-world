import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Unlock } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import StarBackground from "../components/StarBackground";
import { useIsCodeCorrect } from "../hooks/useQueries";

export default function LockScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { mutateAsync: checkCode, isPending } = useIsCodeCorrect();
  const unlockSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    unlockSoundRef.current = new Audio("/assets/Blip Bleep.mp3.m4a");
    unlockSoundRef.current.volume = 0.7;
    return () => {
      if (unlockSoundRef.current) {
        unlockSoundRef.current.pause();
        unlockSoundRef.current.src = "";
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const correct = await checkCode(code);
      if (correct) {
        if (unlockSoundRef.current) {
          unlockSoundRef.current.currentTime = 0;
          unlockSoundRef.current.play().catch(() => {});
        }
        setTimeout(() => navigate({ to: "/dashboard" }), 400);
      } else {
        setError(
          "Wrong code! Hint: Think of the boy who always needs Doraemon's help 🤔",
        );
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-doraemon-sky via-doraemon-blue/30 to-doraemon-navy flex items-center justify-center relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        <GlassPanel glow="blue" float className="p-8">
          <div className="text-center mb-8">
            <img
              src="/assets/generated/lock-screen.dim_800x600.png"
              alt="Doraemon Lock Screen"
              className="w-48 h-36 object-cover rounded-xl mx-auto mb-4 shadow-lg"
            />
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              🔐 Secret World
            </h1>
            <p className="text-white/60 text-sm">
              Enter the secret code to enter Doraemon's world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`transition-transform ${shake ? "animate-shake" : ""}`}
            >
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center animate-pulse">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending || !code.trim()}
              className="w-full bg-doraemon-blue hover:bg-doraemon-blue/80 text-white font-semibold py-3"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Unlock className="w-4 h-4" />
                  Enter
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
              <Lock className="w-3 h-3" />
              <span>Protected by Doraemon's gadgets</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
