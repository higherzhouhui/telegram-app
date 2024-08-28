import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initBackButton,
  initInitData,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
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
import { loginReq } from '@/api/common';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import Congrates from './Congrates';
import EventBus from '@/utils/eventBus';
import Loading from './Loading';
import moment from 'moment';

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const [backButton] = initBackButton()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowCongrates, setShowCongrates] = useState(false)
  const [showTime, setShowTime] = useState(1500)
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)
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
  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
  }, [])

  const login = async () => {
    setLoading(true)
    const initData = initInitData() as any;
    let res: any;
    if (initData && initData.user && initData.user.id) {
      const user = initData.initData.user
      const data = { ...initData.initData, ...user }
      res = await loginReq(data)
    }
    if (res.code == 0) {
      localStorage.setItem('authorization', res.data.user_id)
      dispatch(setUserInfoAction(res.data))
      const check_date = res.data.check_date
      const today = moment().utc().format('MM-DD')
      if (res.data.is_New) {
        navigate('/begin')
      } else if (!check_date || check_date && check_date != today) {
        navigate('/checkIn')
        return
      }
    }
    setLoading(false)
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


  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <div className='layout'>
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
