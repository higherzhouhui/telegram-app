
import '@/mockEnv';
import eruda from "eruda";
// import '@/trackers'

import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';

import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';
import Footer from '@/components/Footer';
import Congrates from '@/components/Congrates';
import EventBus from '@/utils/eventBus';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo, useState } from 'react';


const TgApp: FC = () => {
  const debug = useLaunchParams().startParam === 'debug';
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);
  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (!viewport?.isExpanded) {
      viewport?.expand(); // will expand the Mini App, if it's not
    }
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);
  const eventBus = EventBus.getInstance()
  const [isShowCongrates, setShowCongrates] = useState(false)

  useEffect(() => {
    const onMessage = (flag: boolean) => {
      setShowCongrates(true)
    }
    eventBus.addListener('showCongrates', onMessage)
  }, [])

  useEffect(() => {
    if (debug) {
      eruda.init()
    }
  }, [debug]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <div className='layout' id='layout'>
        <div className='content'>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </div>
        <Footer />
        <Congrates visible={isShowCongrates} callBack={() => setShowCongrates(false)} />
      </div>
    </AppRoot >
  );
};

export default TgApp