import { Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, Home, BookOpen, Star, Gamepad2, MessageCircle, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/memories', label: 'Memories', icon: Heart },
  { path: '/friendship', label: 'Friendship', icon: BookOpen },
  { path: '/quotes', label: 'Quotes', icon: Star },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/chat', label: 'Chat with Nobita', icon: MessageCircle },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = router.state.location.pathname;

  const handleLogout = () => {
    sessionStorage.removeItem('dora_authenticated');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dora-blue/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-dora-blue/40 glow-blue">
              <img
                src="/assets/generated/doraemon-sticker.dim_200x200.png"
                alt="DoraLand"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="font-orbitron font-bold text-lg gradient-text-blue group-hover:opacity-80 transition-opacity">
              DoraLand
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => navigate({ to: path })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-space transition-all duration-200 ${
                    isActive
                      ? 'bg-dora-blue/20 text-dora-blue-light border border-dora-blue/30'
                      : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-space text-foreground/50 hover:text-dora-red hover:bg-dora-red/10 transition-all duration-200"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl glass border border-dora-blue/20 flex items-center justify-center text-foreground/60 hover:text-dora-blue-light transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-dora-blue/20 px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate({ to: path });
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-space transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-dora-blue/20 text-dora-blue-light border border-dora-blue/30'
                      : 'text-foreground/60 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-space text-foreground/50 hover:text-dora-red hover:bg-dora-red/10 transition-all duration-200 mt-1 border-t border-white/10 pt-3"
            >
              <LogOut size={16} />
              <span>Exit</span>
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dora-blue/10 py-6 px-4 text-center">
        <p className="text-foreground/30 font-space text-xs">
          © {new Date().getFullYear()} DoraLand — A magical world 💙
        </p>
        <p className="text-foreground/20 font-space text-xs mt-1">
          Built with{' '}
          <span className="text-dora-red">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'doraland')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dora-blue-light hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
