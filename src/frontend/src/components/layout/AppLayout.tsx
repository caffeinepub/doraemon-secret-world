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
    <div className="min-h-screen bg-gradient-to-br from-doraemon-sky via-doraemon-blue/20 to-doraemon-navy text-white relative">
      <StarBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-doraemon-navy/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-2 font-display text-xl font-bold text-white hover:text-doraemon-yellow transition-colors"
          >
            <img
              src="/assets/generated/doraemon-sticker.dim_200x200.png"
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === path
                    ? "bg-doraemon-blue text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
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
          <nav className="md:hidden bg-doraemon-navy/95 border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                type="button"
                key={path}
                onClick={() => {
                  navigate({ to: path });
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === path
                    ? "bg-doraemon-blue text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
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
      <footer className="relative z-10 border-t border-white/10 bg-doraemon-navy/60 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/50 text-sm">
          <p>
            © {new Date().getFullYear()} Doraemon Secret World. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "doraemon-secret-world")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-doraemon-yellow hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <FloatingMusicControl />
    </div>
  );
}
