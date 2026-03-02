import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, X, Heart } from 'lucide-react';

interface Photo {
  src: string;
  caption: string;
}

const ALL_PHOTOS: Photo[] = [
  {
    src: '/assets/generated/memory-photo-1.dim_800x1000.jpg',
    caption: 'A beautiful moment 💙',
  },
  {
    src: '/assets/generated/memory-photo-2.dim_800x1000.jpg',
    caption: 'By the sea 🌊',
  },
  {
    src: '/assets/generated/memory-photo-3.dim_800x1200.jpg',
    caption: 'Graceful & stunning ✨',
  },
  {
    src: '/assets/generated/memory-photo-4.dim_800x1000.jpg',
    caption: 'Sweet smile 😊',
  },
  {
    src: '/assets/generated/memory-photo-5.dim_800x1000.jpg',
    caption: 'Holding flowers 🌸',
  },
  {
    src: '/assets/generated/memory-photo-6.dim_800x1000.jpg',
    caption: 'Nee Kavithaigala 🎵',
  },
  // memory-photo-7 (6th displayed photo) has been removed per user request
  {
    src: '/assets/generated/memory-photo-8.dim_800x1200.jpg',
    caption: 'Blue vibes 💙',
  },
  {
    src: '/assets/generated/memory-photo-9.dim_800x1200.jpg',
    caption: 'The Batman 🦇',
  },
];

// Remove first and last photos — show only the middle photos
const PHOTOS = ALL_PHOTOS.slice(1, -1);

export default function OurMemoriesPage() {
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  // Play ambient music when entering this page
  // Audio file: /assets/Dreamy.mp3.m4a
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    try {
      audio = new Audio('/assets/Dreamy.mp3.m4a');
      audio.loop = true;
      audio.volume = 0.5;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked — play on first user interaction
          const resumeOnInteraction = () => {
            audio?.play().catch(() => {});
            document.removeEventListener('click', resumeOnInteraction, true);
            document.removeEventListener('touchstart', resumeOnInteraction, true);
          };
          document.addEventListener('click', resumeOnInteraction, { capture: true, passive: true });
          document.addEventListener('touchstart', resumeOnInteraction, { capture: true, passive: true });
        });
      }
    } catch {
      // Silently ignore audio errors
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="w-10 h-10 rounded-full glass border border-dora-red/30 flex items-center justify-center text-foreground/60 hover:text-dora-red transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-dora-red">
              Our Memories
            </h1>
            <p className="text-foreground/50 text-sm font-space mt-1">
              The best moments of my life 💕
            </p>
          </div>
        </div>

        {/* Intro banner */}
        <div className="glass-card rounded-3xl p-6 border border-dora-red/30 glow-red mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-dora-red/10 to-dora-pink/5 opacity-60" />
          <div className="relative z-10">
            <div className="text-5xl mb-3 animate-float">📸</div>
            <h2 className="font-orbitron text-xl font-bold text-dora-red mb-2">
              Precious Moments
            </h2>
            <p className="text-foreground/60 font-nunito text-base max-w-lg mx-auto">
              Every photo here holds a memory that makes my heart smile. These are the moments I treasure the most — just like Nobita treasures every adventure with Doraemon 💙
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Heart size={16} className="text-dora-red animate-pulse" />
              <span className="text-dora-red font-space text-sm font-medium">
                {PHOTOS.length} precious memories
              </span>
              <Heart size={16} className="text-dora-red animate-pulse" />
            </div>
          </div>
        </div>

        {/* Photo Grid - masonry style using columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer mb-4"
              style={{
                animationDelay: `${i * 0.08}s`,
              }}
              onClick={() => setLightbox(photo)}
            >
              {/* Image */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-dora-red" />
                  <p className="text-white font-space text-sm font-medium">{photo.caption}</p>
                </div>
              </div>

              {/* Pink glow border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-dora-red/0 group-hover:border-dora-red/50 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-12">
          <div className="glass rounded-2xl px-8 py-5 inline-block border border-dora-red/20">
            <p className="text-foreground/60 font-nunito italic text-lg">
              "The best memories are made with the people you love" 💕
            </p>
            <p className="text-dora-red text-sm font-space mt-1">— Our Story</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>

          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-dora-red/30">
                <Heart size={14} className="text-dora-red" />
                <p className="text-white font-space text-sm">{lightbox.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
