
import { type FC, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes';
import Footer from '@/components/Footer';
import Congrates from '@/components/Congrates';
import EventBus from '@/utils/eventBus';

const PcApp: FC = () => {
  const eventBus = EventBus.getInstance()
  const [isShowCongrates, setShowCongrates] = useState(false)

  useEffect(() => {
    const onMessage = (flag: boolean) => {
      setShowCongrates(true)
    }
    eventBus.addListener('showCongrates', onMessage)
  }, [])

  return (
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
  );
};

export default PcApp