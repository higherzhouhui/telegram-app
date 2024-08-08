import type { ComponentType, JSX } from 'react';

import HomePage from '@/pages/Home';
import GamePage from '@/pages/Game';
import TaskPage from '@/pages/Task';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

function Tab() {
  return <div style={{ color: 'red', }}>{Math.random()}</div>
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/game', Component: GamePage },
  { path: '/task', Component: TaskPage },
  { path: '/frens', Component: Tab },
  { path: '/wallet', Component: Tab },
];
