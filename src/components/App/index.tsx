
import {
  SDKProvider
} from '@telegram-apps/sdk-react';

import { lazy, Suspense, useEffect, useState, type FC } from 'react';
import Loading from '@/components/Loading';

const TgApp = lazy(() => import('./Tg'))
const PcApp = lazy(() => import('./Pc'))


export const App: FC = () => {
  // 判断当前环境
  const [isTgMini, setIsTgMini] = useState(true)
  const currentTest: string = 'TG'
  useEffect(() => {
    // 本地开发特殊处理
    if (location.href.includes('localhost')) {
      if (currentTest == 'TG') {
        setIsTgMini(true)
      } else {
        setIsTgMini(false)
      }
    } else {
      // 逻辑重写1。先判断是否为tg小程序
      // const search = location.search
      // if (search.includes('tgWebApp')) {
      //   setIsTgMini(true)
      // } else {
      //   setIsTgMini(false)
      // }
    }
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      {
        isTgMini ? <SDKProvider>
          <TgApp />
        </SDKProvider> : <PcApp />
      }

    </Suspense>

  );
};
