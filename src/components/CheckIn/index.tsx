import { useEffect, useState } from 'react'
import './index.scss'
import { getCheckInRewardListReq, userCheckReq } from '@/api/common'
import { formatNumber } from '@/utils/common'
import { Button } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { setUserInfoAction } from '@/redux/slices/userSlice'
import EventBus from '@/utils/eventBus'

export default function ({ handleCallBack }: { handleCallBack: () => void }) {
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance()
  const [checkObj, setCheckObj] = useState<any>()
  const [changeScale, setChangeScale] = useState(false)
  const [rewardsList, setRewardList] = useState([])
  const checkIn = async () => {
    const res = await userCheckReq()
    setCheckObj(res.data)
    dispatch(setUserInfoAction(res.data))
    eventBus.emit('showCongrates', true)
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
                return <div key={index} className={`rewards-item ${checkObj?.day > index ? 'rewards-item-active' : ''}`}>
                  <div className='rewards-item-left'>
                    <div className='count'>{item.day}</div>
                    <div className='desc'>Day</div>
                  </div>
                  <div className='rewards-item-right'>
                    {
                      checkObj?.day > index ? <img src="/assets/toast-success.webp" alt="check" /> : <>
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