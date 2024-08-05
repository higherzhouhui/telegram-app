import { useEffect, useState } from 'react'
import './index.scss'
import { getCheckInRewardListReq, userCheckReq } from '@/api/common'
import { formatNumber } from '@/utils/common'
import { Button } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { setUserInfoAction } from '@/redux/slices/userSlice'

export default function ({ handleCallBack }: { handleCallBack: () => void }) {
  const dispatch = useDispatch()

  const [checkObj, setCheckObj] = useState<any>()
  const [changeScale, setChangeScale] = useState(false)
  const [rewardsList, setRewardList] = useState([])
  const checkIn = async () => {
    const res = await userCheckReq()
    setCheckObj(res.data)
    dispatch(setUserInfoAction(res.data))
  }

  const handleContinue = () => {
    handleCallBack()
  }
  useEffect(() => {
    checkIn()
    getCheckInRewardListReq().then(res => {
      setRewardList(res.data)
    })
  }, [])


  useEffect(() => {
    if (checkObj?.day) {
      setTimeout(() => {
        setChangeScale(true)
      }, 3000);
    }
  }, [checkObj])

  return <div className='checkIn-container'>
    <div className='checkIn-first'>
      <img src='/assets/hooray-8Kybc2vw.gif' alt='hooray' className={`hooray ${changeScale ? 'change-hooray' : ''}`} />
      <div className={`daily-reward ${changeScale ? 'change-daily' : ''}`}>
        {
          !changeScale ? <div className='day'>
            {checkObj?.day}
          </div> : null
        }
        Daily Rewards
      </div>
      {
        !changeScale ? <div className={`rewards-container ${checkObj?.reward_score ? 'fadeIn' : ''}`}>
          <span>Rewards</span>
          <img src="/assets/tomato-32x32.webp" alt="logo" className='rewards-logo' />
          {checkObj?.reward_score}
        </div> : null
      }
      <div className={`${changeScale ? 'fadeIn' : ''} rewards-detail`}>
        <div className='rewards-detail-top'>
          <div className='rewards-two'>
            <div className='rewards-one'>
              <img src='/assets/tomato-32x32.webp' alt='logo' />
              <div className='reward-number'>{checkObj?.reward_score}</div>
              <div className='unit'>$TOMATO</div>
            </div>
            <div className='rewards-one'>
              <img src='/assets/ticket-32x32.webp' alt='logo' />
              <div className='reward-number'>{checkObj?.reward_ticket}</div>
              <div className='unit'>Tickets</div>
            </div>
          </div>
          <div className='check-in-title'>Daily Check-in Rewards</div>
          <div className='rewards-list'>
            {
              rewardsList.map((item: any, index) => {
                return <div key={index} className='rewards-item'>
                  <div className='rewards-item-left'>
                    <div className='count'>{item.day}</div>
                    <div className='desc'>Day</div>
                  </div>
                  <div className='rewards-item-right'>
                    {
                      checkObj?.day > index ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3118" width="15" height="15"><path d="M512 1024C229.230592 1024 0 794.769408 0 512S229.230592 0 512 0s512 229.230592 512 512-229.230592 512-512 512zM254.12608 528.77312l172.396544 174.733312a0.607232 0.607232 0 0 0 0.864256 0.01536l342.540288-343.36768a0.311296 0.311296 0 0 0-0.003072-0.44032l-37.359616-37.285888a0.320512 0.320512 0 0 0-0.443392-0.02048l-304.47616 277.743616c-0.37376 0.340992-0.996352 0.357376-1.381376 0.027648L294.8608 487.48544a0.339968 0.339968 0 0 0-0.452608 0.022528l-40.27904 40.824832a0.3072 0.3072 0 0 0-0.004096 0.44032z" fill="#1afa29" p-id="3119"></path></svg> : <>
                        <div className='score-ticket'>
                          {formatNumber(item.score, 0)}
                          <img src='/assets/tomato-32x32.webp' alt='logo' />
                        </div>
                        <div className='score-ticket'>
                          {item.ticket}
                          <img src='/assets/ticket-32x32.webp' alt='logo' />
                        </div>
                      </>
                    }
                  </div>
                </div>
              })
            }
          </div>
        </div>
        <div className='rewards-detail-top'>
          <Button color="default" style={{ fontWeight: 'bold', flex: 1 }} onClick={() => handleContinue()}>Continue</Button>
        </div>
      </div>
    </div>
  </div>
}