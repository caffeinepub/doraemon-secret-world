import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Lock, Unlock, Heart, Star } from 'lucide-react';
import { useVerifyCode } from '../hooks/useQueries';
import GlassPanel from '../components/GlassPanel';

export default function LockScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const verifyCode = useVerifyCode();

  useEffect(() => {
    if (sessionStorage.getItem('dora_authenticated') === 'true') {
      navigate({ to: '/dashboard' });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError('');
    try {
      const isCorrect = await verifyCode.mutateAsync(code.trim());
      if (isCorrect) {
        setSuccess(true);
        sessionStorage.setItem('dora_authenticated', 'true');
        setTimeout(() => navigate({ to: '/dashboard' }), 1500);
      } else {
        setError("Oops! That's not the right key! 🔑 Try again~");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setCode('');
      }
    } catch {
      setError('Something went wrong. Please try again! 💙');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['💙', '⭐', '🌟', '💫', '✨', '🔵', '💙', '⭐'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.3}s`,
              opacity: 0.4,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Hero illustration */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-dora-blue/10 border-2 border-dora-blue/30 flex items-center justify-center animate-pulse-glow overflow-hidden">
              <img
                src="/assets/generated/lock-screen.dim_800x600.png"
                alt="Doraemon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🔵</span>
              </div>
            </div>
            {/* Orbiting stars */}
            {[0, 120, 240].map((deg, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(70px) rotate(-${deg}deg)`,
                  animation: `orbit ${4 + i}s linear infinite`,
                }}
              >
                <Star size={12} className="text-dora-yellow fill-dora-yellow" />
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-3xl font-bold gradient-text-blue mb-2">
            DoraLand
          </h1>
          <p className="text-foreground/60 font-nunito text-lg">
            A Secret World Made Just For You 💙
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                size={12}
                className="text-dora-red fill-dora-red animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Lock panel */}
        <GlassPanel glowColor="blue" className="p-8">
          {success ? (
            <div className="text-center animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-orbitron text-xl font-bold text-dora-blue-light mb-2">
                Welcome Home!
              </h2>
              <p className="text-foreground/70 font-nunito">
                Opening your secret world... ✨
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {['💙', '⭐', '💙', '⭐', '💙'].map((e, i) => (
                  <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-dora-blue/20 border border-dora-blue/40 mb-4">
                  <Lock size={24} className="text-dora-blue-light" />
                </div>
                <h2 className="font-orbitron text-lg font-bold text-foreground mb-1">
                  Enter Secret Code
                </h2>
                <p className="text-foreground/50 text-sm font-space">
                  Only you know the way in 🗝️
                </p>
              </div>

              <div className={shake ? 'animate-shake' : ''}>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your secret passphrase..."
                  className="dora-input w-full text-center text-lg tracking-widest"
                  autoFocus
                  disabled={verifyCode.isPending}
                />
              </div>

              {error && (
                <div className="text-center animate-fade-in">
                  <p className="text-dora-red text-sm font-nunito bg-dora-red/10 border border-dora-red/30 rounded-xl px-4 py-3">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={verifyCode.isPending || !code.trim()}
                className="dora-btn dora-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyCode.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Unlock size={16} />
                    Enter DoraLand
                  </>
                )}
              </button>

              <p className="text-center text-foreground/30 text-xs font-space">
                Hint: It's the name of our magical world 🌟
              </p>
            </form>
          )}
        </GlassPanel>

        <p className="text-center text-foreground/30 text-xs mt-6 font-space">
          Made with 💙 just for you
        </p>
      </div>
    </div>
  );
}
