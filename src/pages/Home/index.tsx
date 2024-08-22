import EventBus from "@/utils/eventBus";
import './index.scss'
import { useEffect, useState } from "react";
import starIcon from '@/assets/h-star.png'
import checkIcon from '@/assets/h-right.png'
import friendsIcon from '@/assets/h-friends.png'
import gameIcon from '@/assets/game.png'
import taskIcon from '@/assets/task.png'
import walletIcon from '@/assets/wallet.png'
import { Button, Swiper, Toast } from "antd-mobile";
import { judgeIsCheckIn } from '@/utils/common'
import { useDispatch, useSelector } from "react-redux";
import { userCheckReq, bindWalletReq } from "@/api/common";
import { initUtils } from '@telegram-apps/sdk-react';
import { setUserInfoAction } from "@/redux/slices/userSlice";
import LogoIcon from '@/assets/logo.jpg'
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const userInfo = useSelector((state: any) => state.user.info);
  const eventBus = EventBus.getInstance()
  const utils = initUtils();
  const [loading, setLoading] = useState(false)
  const wallet = useTonWallet()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleToScore = async () => {
    navigate('/second?last=true')
  }
  const handleCheckIn = async () => {
    if (judgeIsCheckIn(userInfo?.check_date)) {
      return
    }
    setLoading(true)
    const res = await userCheckReq()
    if (res.code == 0) {
      eventBus.emit('showCongrates', { time: 2000, visible: true })
      dispatch(setUserInfoAction(res.data))
    }
    setLoading(false)
  }


  useEffect(() => {
    if (wallet?.account) {
      bindWalletReq({ wallet: wallet?.account?.address }).then(res => {
        dispatch(setUserInfoAction(res.data))
      })
    }
  }, [wallet])

  return (
    <main>
      <div className="home fadeIn">
        <div className="top" onClick={() => handleToScore()}>
          <div className="top-inner">
            {videoIcon}
            <span>Your Score</span>
          </div>
        </div>
        <div className="logo">
          <img src={LogoIcon} alt="logo" style={{ width: '30vw', objectFit: 'contain' }} />
          <Button className="sign" onClick={() => handleCheckIn()} size="small" loading={loading}>
            {judgeIsCheckIn(userInfo?.check_date) ? 'checked' : 'Check In'}
          </Button>
        </div>
        <div className="score">
          {userInfo?.score?.toLocaleString()}
          <div style={{ fontSize: '1.5rem', opacity: 0.8, lineHeight: '24px' }}>Hamsters</div>
        </div>
        <div className="wallet">
          <TonConnectButton className="connect-btn" />
        </div>
        <div className="wrapper">
          <Swiper autoplay loop>
            <Swiper.Item key={3}>
              <div className="community">
                <div className="Hamsters-com">Developer COMMUNITY</div>
                <div className="home-tg">Business cooperation</div>
                <div className="join-btn" onClick={() => {
                  utils.openTelegramLink('https://t.me/+CFUnnwrLIcgzOWFl')
                }}>Look 🧊</div>
                <div className="heart">💅</div>
              </div>
            </Swiper.Item>
            <Swiper.Item key={1}>
              <div className="community">
                <div className="Hamsters-com">Hamster COMMUNITY</div>
                <div className="home-tg">Home for Telegram OGs</div>
                <div className="join-btn" onClick={() => {
                  utils.openTelegramLink('https://t.me/hamstermemedapp')
                }}>Join 💰</div>
                <div className="heart">💖</div>
              </div>
            </Swiper.Item>
            <Swiper.Item key={2}>
              <div className="community">
                <div className="Hamsters-com">FOLOW US ON X.COM</div>
                <div className="home-tg">stay updated with the latest news</div>
                <div className="join-btn" onClick={() => {
                  window.open('https://x.com/Hamster_meme_')
                }}>Follow 🐹</div>
                <div className="heart">💥</div>
              </div>
            </Swiper.Item>
          </Swiper>
          <div className="reward">
            Your rewards
          </div>
          <div className="list">
            <div className="left">
              <div className="img-wrapper"><img src={starIcon} alt="star" /></div>
              <span>Account Age</span></div>
            <div className="right">+{userInfo?.account_age_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
          </div>
          {
            userInfo?.invite_friends_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={friendsIcon} alt="star" /></div>
                <span>Invited Friends</span></div>
              <div className="right">+{userInfo?.invite_friends_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
            </div> : ''
          }
          {
            userInfo?.game_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={gameIcon} alt="star" /></div>
                <span>Play Game</span></div>
              <div className="right">{userInfo.game_score > 0 ? `+${userInfo.game_score}` : userInfo.game_score}&nbsp;<span className="unit">Hamsters</span></div>
            </div> : ''
          }
          {
            userInfo?.check_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={taskIcon} alt="star" /></div>
                <span>Daily Check-in</span></div>
              <div className="right">+{userInfo.check_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
            </div> : ''
          }
          {
            userInfo?.bind_wallet_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={walletIcon} alt="star" /></div>
                <span>Connect Wallet</span></div>
              <div className="right">+{userInfo.bind_wallet_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
            </div> : ''
          }
          <div className="list">
            <div className="left">
              <div className="img-wrapper"><img src={checkIcon} alt="star" /></div>
              <span>Telegram Premium</span></div>
            <div className="right">{userInfo?.telegram_premium ? `+${userInfo?.telegram_premium}` : 0}&nbsp;<span className="unit">Hamsters</span></div>
          </div>
        </div>
      </div>
    </main>
  )

}


var videoIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22188" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M509.866667 32C245.333333 32 32 247.466667 32 512s213.333333 480 477.866667 480c264.533333 0 477.866667-215.466667 477.866666-480S774.4 32 509.866667 32z m0 896C281.6 928 96 742.4 96 512S281.6 96 509.866667 96 923.733333 281.6 923.733333 512s-185.6 416-413.866666 416z" fill="#ffffff" p-id="22189"></path><path d="M433.066667 354.133333c-6.4-4.266667-17.066667 0-17.066667 10.666667V661.333333c0 8.533333 8.533333 14.933333 17.066667 10.666667l234.666666-149.333333c6.4-4.266667 6.4-14.933333 0-19.2l-234.666666-149.333334z" fill="#ffffff" p-id="22190"></path></svg>

