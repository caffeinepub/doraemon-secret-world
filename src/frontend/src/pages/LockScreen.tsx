import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Unlock } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import dreamyUrl from "/assets/Dreamy.mp3.m4a";
import lockScreenImg from "/assets/generated/lock-screen.dim_800x600.png";
import nobitaSleepImg from "/assets/uploads/IMG_20260130_230611-2-1.jpg";
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
    unlockSoundRef.current = new Audio(dreamyUrl);
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #04081a 0%, #0a102e 50%, #060d1f 100%)",
      }}
    >
      <StarBackground />

      {/* Floating decorative hearts & stars */}
      <div className="absolute left-8 top-1/3 text-4xl animate-float opacity-80 pointer-events-none select-none">
        💙
      </div>
      <div className="absolute right-8 top-1/3 text-4xl animate-float-slow opacity-80 pointer-events-none select-none">
        💙
      </div>
      <div className="absolute left-1/4 top-1/4 text-2xl animate-float opacity-60 pointer-events-none select-none">
        ⭐
      </div>
      <div className="absolute right-1/4 top-1/4 text-2xl animate-float-slow opacity-60 pointer-events-none select-none">
        ⭐
      </div>
      <div className="absolute left-1/3 bottom-1/4 text-xl animate-float opacity-50 pointer-events-none select-none">
        🌟
      </div>
      <div className="absolute right-1/3 bottom-1/3 text-xl animate-float-slow opacity-50 pointer-events-none select-none">
        🌟
      </div>
      <div className="absolute left-16 bottom-1/3 text-3xl animate-float opacity-40 pointer-events-none select-none">
        💫
      </div>
      <div className="absolute right-16 top-1/4 text-3xl animate-float-slow opacity-40 pointer-events-none select-none">
        ✨
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Main title above card */}
        <div className="text-center mb-6">
          <h1
            className="font-orbitron text-5xl md:text-6xl font-black tracking-wider text-white"
            style={{
              textShadow:
                "0 0 20px #00d4ff, 0 0 40px #0099ff, 0 0 80px #0066cc, 0 0 120px #0044aa",
            }}
          >
            DoraLand
          </h1>
          <p className="text-white/70 mt-2 text-sm tracking-widest uppercase font-space">
            A Secret World Made Just For You 💙
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {["❤️", "❤️", "❤️", "❤️", "❤️"].map((h, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative row
              <span key={i} className="text-lg">
                {h}
              </span>
            ))}
          </div>
        </div>

        <GlassPanel
          glow="blue"
          float
          className="p-8 border-2 border-blue-400/70 shadow-[0_0_50px_10px_rgba(0,150,255,0.35)]"
        >
          {/* Lock icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-400/60 bg-blue-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,200,255,0.4)]">
              <Lock className="w-7 h-7 text-cyan-300" />
            </div>
            <h2
              className="font-orbitron text-2xl font-bold text-white text-center"
              style={{ textShadow: "0 0 12px rgba(0,200,255,0.7)" }}
            >
              Enter Secret Code
            </h2>
            <p className="text-white/50 text-sm mt-1 text-center">
              Only you know the way in 🗝️
            </p>
          </div>

          {/* Doraemon image */}
          <div className="flex justify-center mb-5">
            <img
              src={lockScreenImg}
              alt="Doraemon Lock Screen"
              className="w-36 h-28 object-cover rounded-xl shadow-lg border border-blue-400/30"
            />
          </div>

          {/* Nobita sleeping with Doraemon watching */}
          <div className="flex justify-center mb-5">
            <img
              src={nobitaSleepImg}
              alt="Doraemon watching over sleeping Nobita"
              className="w-full rounded-2xl shadow-[0_0_24px_rgba(0,180,255,0.35)] border border-blue-400/40 object-cover"
              style={{ maxHeight: "220px" }}
            />
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
                className="border-blue-400/50 text-white placeholder:text-white/40 text-center text-lg tracking-widest focus:border-cyan-400/80 focus:ring-cyan-400/30"
                style={{
                  background: "rgba(4, 8, 30, 0.85)",
                  boxShadow: "inset 0 0 10px rgba(0, 120, 255, 0.08)",
                }}
                data-ocid="lock.input"
                autoFocus
              />
            </div>

            {error && (
              <p
                className="text-red-400 text-sm text-center animate-pulse"
                data-ocid="lock.error_state"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending || !code.trim()}
              className="w-full font-orbitron font-semibold py-3 tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,140,255,1), rgba(0,80,200,1))",
                boxShadow: "0 4px 20px rgba(0,140,255,0.5)",
                color: "white",
              }}
              data-ocid="lock.submit_button"
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

          <div className="mt-5 text-center">
            <div className="flex items-center justify-center gap-2 text-white/25 text-xs">
              <Lock className="w-3 h-3" />
              <span>Protected by Doraemon's gadgets</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
