
import {
  SDKProvider
} from '@telegram-apps/sdk-react';

import { lazy, Suspense, useEffect, useState, type FC } from 'react';
import Loading from '@/components/Loading';

const TgApp = lazy(() => import('./Tg'))
const PcApp = lazy(() => import('./Pc'))


export const App: FC = () => {
  // 判断当前环境
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // 逻辑重写
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      {
        isMobile ? <SDKProvider>
          <TgApp />
        </SDKProvider> : <PcApp />
      }

    </Suspense>

  );
};
