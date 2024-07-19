import './index.scss';
import '@/trackers'
import { FC, useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import Begin from '@/components/Begin';
import Home from '@/components/Home';
import NewUser from '@/components/NewUser';
import EventBus from '@/utils/eventBus';
import { loginReq } from '@/api/common';
import { useDispatch } from 'react-redux';
import { setUserInfoAction } from '@/redux/slices/userSlice'
import { initInitData } from '@telegram-apps/sdk';
import GameComp from '@/components/Game';

export const IndexPage: FC = () => {
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance();
  const appRef: any = useRef(null);
  const size = useSize(appRef);
  const [appSize, setAppSize] = useState({ width: 0, height: 0 })
  const [step, setStep] = useState(1)
  const [newUserStep, setNewUserStep] = useState(0)

  const login = async () => {
    const initData = initInitData() as any;
    let res: any;
    if (initData && initData.user && initData.user.id) {
      const user = initData.initData.user
      const data = { ...initData.initData, ...user }
      res = await loginReq(data)
    }
    if (res.code == 0) {
      dispatch(setUserInfoAction(res.data))
      localStorage.setItem('authorization', res.data.user_id)
      if (res.data.is_New) {
        setStep(2)
      } else {
        setStep(0)
      }
    }
  }

  useEffect(() => {
    login()
  }, [])

  useEffect(() => {
    if (size && size.height && size.width) {
      setAppSize(size)
    }
    console.log(size)
  }, [size])

  useEffect(() => {
    const onMessage = (index: number) => {
      setStep(index)
      if (index == 2) {
        setNewUserStep(2)
      }
    }
    eventBus.addListener('updateStep', onMessage)
  }, [])
  return (
    <div className="app" ref={appRef}>
      {
        step == 1 ? <Begin /> : step == 2 ? <NewUser cStep={newUserStep} /> : <Home />
      }
    </div>
  )
}

export default IndexPage
