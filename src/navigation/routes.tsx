/* eslint-disable react-refresh/only-export-components */
import { lazy, type ComponentType, type JSX } from 'react';

const HomePage = lazy(() => import('@/pages/Home'))
const GamePage = lazy(() => import('@/pages/Game'))
const TaskPage = lazy(() => import('@/pages/Task'))
const FrensPage = lazy(() => import('@/pages/Frens'))
const WalletPage = lazy(() => import('@/pages/Wallet'))
const AssetsPage = lazy(() => import('@/components/Assets'))
const LeaderBoardPage = lazy(() => import('@/pages/LeaderBoard'))
const FrensDetailPage = lazy(() => import('@/pages/Frens/Detail'))
const CheckInlPage = lazy(() => import('@/pages/CheckIn'))
const IndexPage = lazy(() => import('@/pages/Index'))

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/index', Component: IndexPage },
  { path: '/game', Component: GamePage },
  { path: '/task', Component: TaskPage },
  { path: '/frens', Component: FrensPage },
  { path: '/leaderboard', Component: LeaderBoardPage },
  { path: '/wallet', Component: WalletPage },
  { path: '/frens-detail', Component: FrensDetailPage },
  { path: '/assets', Component: AssetsPage },
  { path: '/checkIn', Component: CheckInlPage },
];
