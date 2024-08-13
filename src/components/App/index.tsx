
import {
  SDKProvider
} from '@telegram-apps/sdk-react';

import { useEffect, useState, type FC } from 'react';
import Loading from '@/components/Loading';
import TgApp from './Tg';
import PcApp from './Pc';

export const App: FC = () => {
  // 判断当前环境
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const screen = window.screen
    if (screen.availWidth > 700) {
      setIsMobile(false)
    } else {
      setIsMobile(true)
    }
    setLoading(false)
  }, [])
  return (
    <>
      {
        isMobile ? <SDKProvider>
          <TgApp />
        </SDKProvider> : <PcApp />
      }

      {
        loading ? <Loading /> : null
      }
    </>

  );
};
