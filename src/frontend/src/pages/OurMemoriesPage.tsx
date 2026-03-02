import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import GlassPanel from "../components/GlassPanel";

const photos = [
  {
    src: "/assets/generated/memory-photo-1.dim_800x1000.jpg",
    caption: "A beautiful memory 💙",
  },
  {
    src: "/assets/generated/memory-photo-2.dim_800x1000.jpg",
    caption: "Together always 🌟",
  },
  {
    src: "/assets/generated/memory-photo-3.dim_800x1200.jpg",
    caption: "Precious moments ✨",
  },
  {
    src: "/assets/generated/memory-photo-4.dim_800x1000.jpg",
    caption: "Smiles and laughter 😊",
  },
  {
    src: "/assets/generated/memory-photo-5.dim_800x1000.jpg",
    caption: "Adventures await 🎉",
  },
  {
    src: "/assets/generated/memory-photo-8.dim_800x1200.jpg",
    caption: "Cherished times 🎊",
  },
  {
    src: "/assets/generated/memory-photo-9.dim_800x1200.jpg",
    caption: "Love and joy ❤️",
  },
];

export default function OurMemoriesPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/assets/Dreamy.mp3.m4a");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };

    audio.play().catch(() => {
      document.addEventListener("click", tryPlay, true);
      document.addEventListener("touchstart", tryPlay, true);
    });

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", tryPlay, true);
      document.removeEventListener("touchstart", tryPlay, true);
    };
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft")
        setLightboxIndex((idx) =>
          idx !== null ? (idx - 1 + photos.length) % photos.length : null,
        );
      if (e.key === "ArrowRight")
        setLightboxIndex((idx) =>
          idx !== null ? (idx + 1) % photos.length : null,
        );
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          📸 Our Memories
        </h1>
        <p className="text-white/60 text-lg">
          A gallery of our most precious moments together
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <GlassPanel
            key={photo.src}
            glow={index % 2 === 0 ? "blue" : "cyan"}
            hover
            onClick={() => openLightbox(index)}
            className="overflow-hidden p-0"
          >
            <div className="relative group">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                <p className="text-white text-sm font-medium p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </p>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled via window keydown listener
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 rounded-full p-2"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            className="absolute left-4 text-white/70 hover:text-white bg-black/50 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((idx) =>
                idx !== null ? (idx - 1 + photos.length) % photos.length : null,
              );
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only, no action */}
          <div
            className="max-w-2xl max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].caption}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white/80 text-lg font-medium">
              {photos[lightboxIndex].caption}
            </p>
            <p className="text-white/40 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </div>

          <button
            type="button"
            className="absolute right-4 text-white/70 hover:text-white bg-black/50 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((idx) =>
                idx !== null ? (idx + 1) % photos.length : null,
              );
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
