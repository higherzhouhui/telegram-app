import './index.scss';
import '@/trackers'
import { FC, useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import Begin from '@/components/Begin';
import Home from '@/components/Home';
import NewUser from '@/components/NewUser';
import EventBus from '@/utils/eventBus';
import WebApp from '@twa-dev/sdk'
import { loginReq } from '@/api/common';
import { useDispatch } from 'react-redux';
import { setUserInfoAction } from '@/redux/slices/userSlice'

export const IndexPage: FC = () => {
  WebApp.ready()
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance();
  const appRef: any = useRef(null);
  const size = useSize(appRef);
  const [appSize, setAppSize] = useState({ width: 0, height: 0 })
  const [step, setStep] = useState(1)
  const [newUserStep, setNewUserStep] = useState(0)

  const login = async () => {
    const initData = WebApp.initDataUnsafe
    let res: any;
    if (initData?.user?.id) {
      const user = WebApp.initDataUnsafe.user
      delete initData.user
      res = await loginReq({ ...initData, ...user })
    } else {
      res = await loginReq({
        query_id: 'AAE_Tv5XAgAAAD9O_lds0lWY',
        auth_date: '1720883932',
        hash: '21380e055a32d77fc2401bec59f7aab2db41eb645c36dc49ff18ed8e2324a2e5',
        id: 5771251263,
        first_name: 'leborn',
        last_name: 'james',
        username: 'cloudljj',
        language_code: 'zh-hans',
        allows_write_to_pm: true,
      })
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
