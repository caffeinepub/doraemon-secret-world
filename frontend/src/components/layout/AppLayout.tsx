import { Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Heart, Home, BookOpen, Star, Gamepad2, MessageCircle, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/memories', label: 'Memories', icon: Heart },
  { path: '/friendship', label: 'Friendship', icon: BookOpen },
  { path: '/quotes', label: 'Quotes', icon: Star },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
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
      <header className="sticky top-0 z-50 glass-strong border-b border-dora-blue/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-dora-blue/20 border border-dora-blue/40 flex items-center justify-center animate-pulse-glow">
              <span className="text-xl">🔵</span>
            </div>
            <span className="font-orbitron font-bold text-lg gradient-text-blue hidden sm:block">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-space font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-dora-blue/20 text-dora-blue-light border border-dora-blue/40 glow-blue'
                      : 'text-foreground/70 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-sm text-foreground/60 hover:text-dora-red hover:bg-dora-red/10 transition-all duration-300"
            >
              <LogOut size={15} />
              <span className="font-space">Exit</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full glass border border-dora-blue/30"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden glass-strong border-t border-dora-blue/20 px-4 py-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = currentPath === path;
                return (
                  <button
                    key={path}
                    onClick={() => { navigate({ to: path }); setMobileOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-space font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-dora-blue/20 text-dora-blue-light border border-dora-blue/40'
                        : 'text-foreground/70 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-dora-red hover:bg-dora-red/10 transition-all duration-300"
              >
                <LogOut size={16} />
                Exit
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-dora-blue/20 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-foreground/40 text-sm font-space">
            © {new Date().getFullYear()} DoraLand — A Secret World Made With{' '}
            <span className="text-dora-red animate-pulse">❤️</span>
          </p>
          <p className="text-foreground/30 text-xs mt-1 font-space">
            Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'doraland')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dora-blue-light hover:text-dora-blue transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
