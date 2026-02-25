import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import LockScreen from './pages/LockScreen';
import DashboardPage from './pages/DashboardPage';
import MemoriesPage from './pages/MemoriesPage';
import FriendshipPage from './pages/FriendshipPage';
import QuotesPage from './pages/QuotesPage';
import GamesPage from './pages/GamesPage';
import SlidingPuzzlePage from './pages/games/SlidingPuzzlePage';
import MazePage from './pages/games/MazePage';
import MemoryMatchPage from './pages/games/MemoryMatchPage';
import ChatPage from './pages/ChatPage';
import AppLayout from './components/layout/AppLayout';
import FloatingMusicControl from './components/FloatingMusicControl';
import StarBackground from './components/StarBackground';

function isAuthenticated(): boolean {
  return sessionStorage.getItem('dora_authenticated') === 'true';
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <StarBackground />
      <Outlet />
      <FloatingMusicControl />
      <Toaster />
    </>
  ),
});

const lockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LockScreen,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const memoriesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/memories',
  component: MemoriesPage,
});

const friendshipRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/friendship',
  component: FriendshipPage,
});

const quotesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/quotes',
  component: QuotesPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games',
  component: GamesPage,
});

const puzzleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/puzzle',
  component: SlidingPuzzlePage,
});

const mazeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/maze',
  component: MazePage,
});

const memoryMatchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/memory',
  component: MemoryMatchPage,
});

const chatRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/chat',
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([
  lockRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    memoriesRoute,
    friendshipRoute,
    quotesRoute,
    gamesRoute,
    puzzleRoute,
    mazeRoute,
    memoryMatchRoute,
    chatRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
