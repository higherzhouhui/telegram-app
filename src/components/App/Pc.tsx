
import { type FC, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';
import Congrates from '@/components/Congrates';
import EventBus from '@/utils/eventBus';

const PcApp: FC = () => {
  // 判断是否为H5；如果是H5直接显示二维码；
  const [isH5, setIsH5] = useState(false)
  const eventBus = EventBus.getInstance()
  const [isShowCongrates, setShowCongrates] = useState(false)

  useEffect(() => {
    const onMessage = (flag: boolean) => {
      setShowCongrates(true)
    }
    const screen = window.screen
    if (screen.availHeight < 700) {
      setIsH5(true)
    }
    eventBus.addListener('showCongrates', onMessage)
  }, [])

  return (
    <>
      {
        isH5 ? <div className='qrCode'>
          <div>Play with telegram app.</div>
          <img src='/assets/frenpet.png' alt='qrCode' />
          <div>@frenpetgame_bot</div>
        </div> : <div className='layout'>
          <div className='content'>
            <Routes>
              {routes.map((route) => <Route key={route.path} {...route} />)}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </div>
          <Congrates visible={isShowCongrates} callBack={() => setShowCongrates(false)} />
        </div>
      }
    </>
  );
};

export default PcApp