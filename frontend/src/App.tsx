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
import GadgetClickerPage from './pages/games/GadgetClickerPage';
import ExamQuizPage from './pages/games/ExamQuizPage';
import WhackADoraemonPage from './pages/games/WhackADoraemonPage';
import ChatPage from './pages/ChatPage';
import OurMemoriesPage from './pages/OurMemoriesPage';
import AppLayout from './components/layout/AppLayout';
import FloatingMusicControl from './components/FloatingMusicControl';
import StarBackground from './components/StarBackground';
import { useDoubleKnockSound } from './hooks/useDoubleKnockSound';

function isAuthenticated(): boolean {
  return sessionStorage.getItem('dora_authenticated') === 'true';
}

function RootLayout() {
  useDoubleKnockSound();

  return (
    <>
      <StarBackground />
      <Outlet />
      <FloatingMusicControl />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
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

const slidingPuzzleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/sliding-puzzle',
  component: SlidingPuzzlePage,
});

const mazeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/maze',
  component: MazePage,
});

const memoryMatchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/memory-match',
  component: MemoryMatchPage,
});

const gadgetClickerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/gadget-clicker',
  component: GadgetClickerPage,
});

const examQuizRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/exam-quiz',
  component: ExamQuizPage,
});

const whackADoraemonRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/games/whack-a-doraemon',
  component: WhackADoraemonPage,
});

const chatRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/chat',
  component: ChatPage,
});

const ourMemoriesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/our-memories',
  component: OurMemoriesPage,
});

const routeTree = rootRoute.addChildren([
  lockRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    memoriesRoute,
    friendshipRoute,
    quotesRoute,
    gamesRoute,
    slidingPuzzleRoute,
    mazeRoute,
    memoryMatchRoute,
    gadgetClickerRoute,
    examQuizRoute,
    whackADoraemonRoute,
    chatRoute,
    ourMemoriesRoute,
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
