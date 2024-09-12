import {
  bindViewportCSSVars,
  initBackButton,
  initInitData,
  initMiniApp,
  initSwipeBehavior,
  initViewport,
  retrieveLaunchParams
} from '@telegram-apps/sdk';

import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { routes } from '@/navigation/routes';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { getSystemReq, loginReq } from '@/api/common';
import { setSystemAction, setUserInfoAction } from '@/redux/slices/userSlice';
import Congrates from './Congrates';
import EventBus from '@/utils/eventBus';
import Loading from './Loading';
import moment from 'moment';
import PriceComp from './Price';

export const App: FC = () => {
  const [backButton] = initBackButton()
  const [swipeBehavior] = initSwipeBehavior();
  const [viewport] = initViewport();
  const [miniApp] = initMiniApp()
  const launchParams = retrieveLaunchParams()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowCongrates, setShowCongrates] = useState(false)
  const [showTime, setShowTime] = useState(1500)
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)

  const login = async () => {
    setLoading(true)
    try {
      const initData = initInitData() as any;
      let resArray: any;
      if (initData && initData.user && initData.user.id) {
        const user = initData.initData.user
        const data = { ...initData.initData, ...user }
        resArray = await Promise.all([loginReq(data), getSystemReq()])
      }
      const [res, sys] = resArray
      if (sys.code == 0) {
        dispatch(setSystemAction(sys.data))
      }
      if (res.code == 0) {
        localStorage.setItem('authorization', res.data.token)
        dispatch(setUserInfoAction(res.data))
        const check_date = res.data.check_date
        const today = moment().utc().format('MM-DD')
        if (res.data.is_New) {
          navigate('/begin')
        } else if (!check_date || check_date && check_date != today) {
          navigate('/checkIn')
        }
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }
  const expandViewPort = async () => {
    const vp = await viewport;
    if (!vp.isExpanded) {
      vp.expand(); // will expand the Mini App, if it's not
    }
    bindViewportCSSVars(vp);
  }

  useEffect(() => {
    login()
    const onMessage = ({ visible, time }: { visible: boolean, time?: number }) => {
      setShowCongrates(visible)
      setShowTime(time || 1500)
    }
    const onLoading = (flag: boolean) => {
      setLoading(flag)
    }
    eventBus.addListener('showCongrates', onMessage)
    eventBus.addListener('loading', onLoading)
  }, [])

  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
    swipeBehavior.disableVerticalSwipe();
    // const tp = initThemeParams();
    // bindThemeParamsCSSVars(tp);
    expandViewPort()
  }, [])

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}
    >
      <div className='layout'>
        {
          import.meta.env.PROD ? <PriceComp /> : <div></div>
        }
        <div className='content'>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </div>
        <Footer />
        <Congrates visible={isShowCongrates} time={showTime} callBack={() => setShowCongrates(false)} />
        {
          loading ? <Loading /> : null
        }
      </div>
    </AppRoot>
  );
};


