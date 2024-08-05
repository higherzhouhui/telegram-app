import './index.scss';
import '@/trackers'
import { FC, useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import EventBus from '@/utils/eventBus';
import { loginReq } from '@/api/common';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfoAction } from '@/redux/slices/userSlice'
import { initBackButton, initInitData } from '@telegram-apps/sdk';
import Link from '@/components/Link'
import Loading from '@/components/Loading';
import CheckIn from '@/components/CheckIn';
import moment from 'moment';

export const HomePage: FC = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: any) => state.user.info);
  const eventBus = EventBus.getInstance();
  const appRef: any = useRef(null);
  const size = useSize(appRef);
  const [appSize, setAppSize] = useState({ width: 0, height: 0 })
  const [step, setStep] = useState(1)
  const [backButton] = initBackButton();
  const [loading, setLoading] = useState(true)
  const [isCheck, setIsCheck] = useState(false)
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
      setLoading(false)
      if (res.data.check_date) {
        const today = moment().format('MM-DD')
        if (res.data.check_date == today) {
          setIsCheck(true)
        }
      }
    }
  }

  useEffect(() => {
    login()
    backButton.hide()
  }, [])

  useEffect(() => {
    if (size && size.height && size.width) {
      setAppSize(size)
    }
  }, [size])


  return (
    <div className="home-page">
      {
        loading ? <Loading /> : !isCheck ? <CheckIn handleCallBack={() => setIsCheck(true)} /> : null
      }
      <div className='top-title'>
        <div className='score'>{userInfo?.score?.toLocaleString()}</div>
        <div className='unit'>
          <img src='/assets/tomato-32x32.webp' alt='unit' />
          <span>$TOMATO</span>
        </div>
      </div>
      <div className='tree'>
        <img src='/assets/tree-b2-BOf2G7lI.gif' alt='tree' />
      </div>
      <div className='btn-container'>
        <div className='btn-top'>
          <div className='btn-top-left'>
            <div className='question'>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5414" width="28" height="28"><path d="M845.902988 0.000232H178.097244A177.864812 177.864812 0 0 0 0.000232 178.097244v667.805744a177.864812 177.864812 0 0 0 178.097012 178.097012h667.805744a177.864812 177.864812 0 0 0 178.097012-178.097012V178.097244A177.864812 177.864812 0 0 0 845.902988 0.000232zM512.000116 911.615445A75.929234 75.929234 0 1 1 587.929351 835.91841a77.090232 77.090232 0 0 1-75.929235 75.697035z m75.929235-340.172258v51.548287a75.929234 75.929234 0 0 1-151.858469 0v-114.938749a75.697035 75.697035 0 0 1 75.929234-75.929235A84.056217 84.056217 0 1 0 428.176099 348.299473a76.161434 76.161434 0 1 1-152.090669 0 235.914686 235.914686 0 1 1 311.843921 223.375913z" fill="#040000" p-id="5415"></path></svg>
            </div>
            <div className='anima'>
              <img src="/assets/cat-touched-Bmke-Bss.gif" alt="cat" width={28} />
            </div>
          </div>
          <div className='btn-top-right'>
            <Link to={'/game'}>
              play now {userInfo.ticket + userInfo.every_day_ticket}
            </Link>
          </div>
        </div>
        <div className='btn-bot'>
          <div className='progress' />
          <div className='btn-bot-content'>
            Start Farming
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
