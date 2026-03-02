import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AppLayout from "./components/layout/AppLayout";
import { useDoubleKnockSound } from "./hooks/useDoubleKnockSound";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import FriendshipPage from "./pages/FriendshipPage";
import GamesPage from "./pages/GamesPage";
import LockScreen from "./pages/LockScreen";
import MemoriesPage from "./pages/MemoriesPage";
import OurMemoriesPage from "./pages/OurMemoriesPage";
import QuotesPage from "./pages/QuotesPage";
import ExamQuizPage from "./pages/games/ExamQuizPage";
import GadgetClickerPage from "./pages/games/GadgetClickerPage";
import MazePage from "./pages/games/MazePage";
import MemoryMatchPage from "./pages/games/MemoryMatchPage";
import SlidingPuzzlePage from "./pages/games/SlidingPuzzlePage";
import WhackADoraemonPage from "./pages/games/WhackADoraemonPage";

const queryClient = new QueryClient();

function RootLayout() {
  useDoubleKnockSound();
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const lockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LockScreen,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games",
  component: GamesPage,
});

const chatRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/chat",
  component: ChatPage,
});

const memoriesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/memories",
  component: MemoriesPage,
});

const quotesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/quotes",
  component: QuotesPage,
});

const friendshipRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/friendship",
  component: FriendshipPage,
});

const ourMemoriesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/our-memories",
  component: OurMemoriesPage,
});

const examQuizRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/exam-quiz",
  component: ExamQuizPage,
});

const gadgetClickerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/gadget-clicker",
  component: GadgetClickerPage,
});

const mazeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/maze",
  component: MazePage,
});

const memoryMatchRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/memory-match",
  component: MemoryMatchPage,
});

const slidingPuzzleRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/sliding-puzzle",
  component: SlidingPuzzlePage,
});

const whackADoraemonRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/games/whack-a-doraemon",
  component: WhackADoraemonPage,
});

const routeTree = rootRoute.addChildren([
  lockRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    gamesRoute,
    chatRoute,
    memoriesRoute,
    quotesRoute,
    friendshipRoute,
    ourMemoriesRoute,
    examQuizRoute,
    gadgetClickerRoute,
    mazeRoute,
    memoryMatchRoute,
    slidingPuzzleRoute,
    whackADoraemonRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
