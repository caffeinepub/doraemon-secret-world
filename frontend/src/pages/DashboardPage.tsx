import { useNavigate } from '@tanstack/react-router';
import { Heart, BookOpen, Star, Gamepad2, MessageCircle, Sparkles, Camera } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useActor } from '../hooks/useActor';
import { seedDataIfNeeded } from '../utils/seedData';

const PORTALS = [
  {
    path: '/memories',
    label: 'Our Memories',
    emoji: '💙',
    icon: Heart,
    description: 'Our precious moments together',
    gradient: 'from-dora-red/20 to-dora-pink/10',
    border: 'border-dora-red/40',
    glow: 'glow-red',
    textColor: 'text-dora-red',
  },
  {
    path: '/friendship',
    label: 'Nobita & Doraemon',
    emoji: '🤝',
    icon: BookOpen,
    description: 'The greatest friendship story',
    gradient: 'from-dora-blue/20 to-dora-cyan/10',
    border: 'border-dora-blue/40',
    glow: 'glow-blue',
    textColor: 'text-dora-blue-light',
  },
  {
    path: '/quotes',
    label: 'Quotes & Facts',
    emoji: '⭐',
    icon: Star,
    description: 'Wisdom from the future',
    gradient: 'from-dora-yellow/20 to-dora-yellow/5',
    border: 'border-dora-yellow/40',
    glow: 'glow-yellow',
    textColor: 'text-dora-yellow',
  },
  {
    path: '/games',
    label: 'Games & Puzzles',
    emoji: '🎮',
    icon: Gamepad2,
    description: 'Play & have fun!',
    gradient: 'from-dora-cyan/20 to-dora-blue/10',
    border: 'border-dora-cyan/40',
    glow: 'glow-cyan',
    textColor: 'text-dora-cyan',
  },
  {
    path: '/chat',
    label: 'Chat with Nobita',
    emoji: '💬',
    icon: MessageCircle,
    description: 'Talk to Nobita anytime!',
    gradient: 'from-dora-blue/20 to-dora-pink/10',
    border: 'border-dora-blue/40',
    glow: 'glow-blue',
    textColor: 'text-dora-blue-light',
  },
  {
    path: '/our-memories',
    label: 'Our Memories 📸',
    emoji: '🌸',
    icon: Camera,
    description: 'Best moments of my life',
    gradient: 'from-dora-red/20 to-dora-yellow/10',
    border: 'border-dora-red/40',
    glow: 'glow-red',
    textColor: 'text-dora-red',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Seed data on mount
  useEffect(() => {
    if (actor) {
      seedDataIfNeeded(actor);
    }
  }, [actor]);

  // Background BGM — loop Doremon_theme while on this page
  useEffect(() => {
    const audio = new Audio('/assets/audio/Doremon_theme');
    audio.loop = true;
    audio.volume = 0.4;
    bgmRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — play on first user interaction
        const resumeOnInteraction = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', resumeOnInteraction);
          document.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.addEventListener('click', resumeOnInteraction);
        document.addEventListener('touchstart', resumeOnInteraction);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      bgmRef.current = null;
    };
  }, []);

  // Click sound for Doraemon hero image
  const handleDoraemonClick = () => {
    if (!clickSoundRef.current) {
      clickSoundRef.current = new Audio('/assets/audio/VID_20260301_052016.MP4');
    }
    const sound = clickSoundRef.current;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-dora-blue/40 glow-blue animate-pulse-glow cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={handleDoraemonClick}
                title="Click me! 🔔"
              >
                <img
                  src="/assets/generated/doraemon-hero.dim_400x400.png"
                  alt="Doraemon"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-8xl">🔵</div>';
                  }}
                />
              </div>
              {['⭐', '💙', '✨'].map((emoji, i) => (
                <div
                  key={i}
                  className="absolute text-xl pointer-events-none"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 120}deg) translateX(90px) rotate(-${i * 120}deg)`,
                    animation: `orbit ${5 + i}s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="text-dora-yellow animate-twinkle" size={24} />
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold gradient-text-blue">
              Welcome to DoraLand
            </h1>
            <Sparkles className="text-dora-yellow animate-twinkle delay-300" size={24} />
          </div>

          <p className="text-foreground/60 font-nunito text-xl max-w-lg mx-auto">
            A magical world built just for you, with love 💙
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            {['🔵', '⭐', '💙', '⭐', '🔵'].map((e, i) => (
              <span
                key={i}
                className="text-xl animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTALS.map(({ path, label, emoji, icon: Icon, description, gradient, border, glow, textColor }, i) => (
            <button
              key={path}
              onClick={() => navigate({ to: path })}
              className={`group relative glass-card rounded-3xl p-6 border ${border} ${glow} hover-lift text-left transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border ${border} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                    {emoji}
                  </div>
                  <div>
                    <h3 className={`font-orbitron font-bold text-lg ${textColor}`}>
                      {label}
                    </h3>
                    <p className="text-foreground/50 text-sm font-space">
                      {description}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 ${textColor} text-sm font-space font-medium`}>
                  <Icon size={14} />
                  <span>Explore →</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-12">
          <div className="glass rounded-2xl px-8 py-4 inline-block border border-dora-blue/20">
            <p className="text-foreground/60 font-nunito italic text-lg">
              "Friendship is the greatest gadget in the universe" 💙
            </p>
            <p className="text-dora-blue-light text-sm font-space mt-1">— Doraemon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
