
import {
  SDKProvider
} from '@telegram-apps/sdk-react';

import { useEffect, useState, type FC } from 'react';
import Loading from '@/components/Loading';
import TgApp from './Tg';

export const App: FC = () => {
  // 判断当前环境
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    console.log(userAgent, 11111111111)
    setLoading(false)
  }, [])
  return (
    <>
      <SDKProvider>
        <TgApp />
      </SDKProvider>
      {
        loading ? <Loading /> : null
      }
    </>

  );
};
