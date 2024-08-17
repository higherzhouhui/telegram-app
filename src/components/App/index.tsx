
import {
  SDKProvider
} from '@telegram-apps/sdk-react';

import { lazy, Suspense, type FC } from 'react';
import Loading from '@/components/Loading';

const TgApp = lazy(() => import('./Tg'))

export const App: FC = () => {

  return (
    <Suspense fallback={<Loading />}>
      <SDKProvider>
        <TgApp />
      </SDKProvider>
    </Suspense>

  );
};
