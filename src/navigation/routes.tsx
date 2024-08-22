import type { ComponentType, JSX } from 'react';

import BeginPage from '@/pages/Welecom';
import HomePage from '@/pages/Home';
import EmjoyGamePage from '@/pages/EmjoyGame';
import LeaderBoardPage from '@/pages/LeaderBoard';
import FrensPage from '@/pages/Frens';
import GamePage from '@/pages/Game';
import DonwGamePage from '@/pages/DonwGame';
import DetailPage from '@/pages/Detail';
import SecondPage from '@/pages/Second'
interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

function Tab() {
  return <div style={{ color: 'red', width: '100vw', height: '100vh', position: 'fixed' }}>1111</div>
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/begin', Component: BeginPage },
  { path: '/second', Component: SecondPage },
  { path: '/emjoyGame', Component: EmjoyGamePage },
  { path: '/downGame', Component: DonwGamePage },
  { path: '/leaderBoard', Component: LeaderBoardPage },
  { path: '/frens', Component: FrensPage },
  { path: '/game', Component: GamePage },
  { path: '/detail', Component: DetailPage },
];
