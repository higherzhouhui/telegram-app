import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo, useState } from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';
import Footer from './Footer';
import Congrates from './Congrates';
import EventBus from '@/utils/eventBus';

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const eventBus = EventBus.getInstance()
  const [isShowCongrates, setShowCongrates] = useState(false)
  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  useEffect(() => {
    const onMessage = (flag: boolean) => {
      setShowCongrates(true)
    }
    eventBus.addListener('showCongrates', onMessage)
  }, [])

  // Create a new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);
  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  // useEffect(() => {
  //   navigator.attach();
  //   return () => navigator.detach();
  // }, [navigator]);


  return (

    <HashRouter>
      <div className='layout'>
        <div className='content'>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </div>
        <Footer />
        <Congrates visible={isShowCongrates} callBack={() => setShowCongrates(false)} />
      </div>
    </HashRouter>
  );
};
