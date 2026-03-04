import { Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  Gamepad2,
  Heart,
  Home,
  Image,
  Menu,
  MessageCircle,
  Quote,
  X,
} from "lucide-react";
import React, { useState } from "react";
import doraemonStickerImg from "/assets/generated/doraemon-sticker.dim_200x200.png";
import FloatingMusicControl from "../FloatingMusicControl";
import StarBackground from "../StarBackground";

const navItems = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/games", label: "Games", icon: Gamepad2 },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/memories", label: "Memories", icon: BookOpen },
  { path: "/quotes", label: "Quotes", icon: Quote },
  { path: "/friendship", label: "Friendship", icon: Heart },
  { path: "/our-memories", label: "Our Memories", icon: Image },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = router.state.location.pathname;

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        background:
          "linear-gradient(180deg, #04081a 0%, #0a102e 60%, #060d1f 100%)",
      }}
    >
      <StarBackground />

      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-blue-400/20"
        style={{ background: "rgba(6, 14, 36, 0.92)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-2 font-display text-xl font-bold text-white hover:text-doraemon-yellow transition-colors"
          >
            <img
              src={doraemonStickerImg}
              alt="Doraemon"
              className="w-8 h-8 object-contain"
            />
            <span>Doraemon World</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                type="button"
                key={path}
                onClick={() => navigate({ to: path })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPath === path
                    ? "bg-blue-500/30 text-cyan-300 border border-blue-400/50 shadow-[0_0_12px_rgba(0,180,255,0.3)]"
                    : "text-white/70 hover:text-cyan-300 hover:bg-blue-500/15 hover:border-blue-400/30 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav
            className="md:hidden border-t border-blue-400/20 px-4 py-3 flex flex-col gap-1"
            style={{ background: "rgba(4, 8, 26, 0.96)" }}
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                type="button"
                key={path}
                onClick={() => {
                  navigate({ to: path });
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPath === path
                    ? "bg-blue-500/30 text-cyan-300 border border-blue-400/50"
                    : "text-white/70 hover:text-cyan-300 hover:bg-blue-500/15 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t border-blue-400/15 backdrop-blur-md py-6 mt-12"
        style={{ background: "rgba(4, 8, 26, 0.75)" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Doraemon Secret World 💙</p>
        </div>
      </footer>

      <FloatingMusicControl />
    </div>
  );
}
