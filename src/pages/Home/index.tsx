import './index.scss'
import EventBus from "@/utils/eventBus";
import { FC, useEffect, useState } from "react";
import starIcon from '@/assets/h-star.png'
import checkIcon from '@/assets/h-right.png'
import friendsIcon from '@/assets/h-friends.png'
import gameIcon from '@/assets/game.png'
import taskIcon from '@/assets/task.png'
import walletIcon from '@/assets/wallet.png'
import { Modal, Popup, ProgressCircle, Swiper } from "antd-mobile";
import { judgeIsCheckIn } from '@/utils/common'
import { useDispatch, useSelector } from "react-redux";
import { userCheckReq, bindWalletReq } from "@/api/common";
import { initUtils, useHapticFeedback } from '@telegram-apps/sdk-react';
import { setUserInfoAction } from "@/redux/slices/userSlice";
import LogoIcon from '@/assets/logo.jpg'
import { useTonWallet, useTonConnectModal } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";
import BackTop from "@/components/BackTop";

export default function Home() {
  const userInfo = useSelector((state: any) => state.user.info);
  const hmstrInfo = useSelector((state: any) => state.user.hmstr);
  const eventBus = EventBus.getInstance()
  const utils = initUtils();
  const [loading, setLoading] = useState(false)
  const [isShowRules, setShowRules] = useState(false)
  const wallet = useTonWallet()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const hapticFeedback = useHapticFeedback()
  const modal = useTonConnectModal()
  const [visible, setVisible] = useState(false)
  const handleToScore = async () => {
    navigate('/second?last=true')
  }
  const handleClaim = () => {
    hapticFeedback.notificationOccurred('success')
    if (!wallet) {
      modal.open()
    } else {
      setVisible(true)
    }
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
          {/* <Button className="sign" onClick={() => handleCheckIn()} size="small" loading={loading}>
            {judgeIsCheckIn(userInfo?.check_date) ? 'checked' : 'Check In'}
          </Button> */}
          <div className="question" onClick={() => setShowRules(true)}>
            <img src="/assets/question.png" width={20} />
          </div>
        </div>
        <div className="score">
          <div style={{ fontSize: '1.5rem', opacity: 0.9, lineHeight: '24px' }}>Assets (HMSTR)</div>
          <div className="amount">{userInfo?.score?.toLocaleString()}</div>
          <div className="really-price">&asymp; ${(Math.round(userInfo?.score * hmstrInfo?.price * 100) / 100).toFixed(2)}</div>
        </div>
        <div className="wallet">
          <div className="wallet-inner" onClick={() => handleClaim()}>
            Claim Airdrop
            <img src="/assets/airdrop.png" />
          </div>
        </div>
        <div className="wrapper">
          <Swiper autoplay loop>
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
                <div className="join-btn follow-btn" onClick={() => {
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
            <div className="right">+{userInfo?.account_age_score || 0}&nbsp;<span className="unit">HMSTR</span></div>
          </div>
          {
            userInfo?.invite_friends_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={friendsIcon} alt="star" /></div>
                <span>Invited Friends</span></div>
              <div className="right">+{userInfo?.invite_friends_score || 0}&nbsp;<span className="unit">HMSTR</span></div>
            </div> : ''
          }
          {
            userInfo?.game_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={gameIcon} alt="star" /></div>
                <span>Play Game</span></div>
              <div className="right">{userInfo.game_score > 0 ? `+${userInfo.game_score}` : userInfo.game_score}&nbsp;<span className="unit">HMSTR</span></div>
            </div> : ''
          }
          {
            userInfo?.check_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={taskIcon} alt="star" /></div>
                <span>Daily Check-in</span></div>
              <div className="right">+{userInfo.check_score || 0}&nbsp;<span className="unit">HMSTR</span></div>
            </div> : ''
          }
          {
            userInfo?.bind_wallet_score ? <div className="list">
              <div className="left">
                <div className="img-wrapper"><img src={walletIcon} alt="star" /></div>
                <span>Connect Wallet</span></div>
              <div className="right">+{userInfo.bind_wallet_score || 0}&nbsp;<span className="unit">HMSTR</span></div>
            </div> : ''
          }
          <div className="list">
            <div className="left">
              <div className="img-wrapper"><img src={checkIcon} alt="star" /></div>
              <span>Telegram Premium</span></div>
            <div className="right">{userInfo?.telegram_premium ? `+${userInfo?.telegram_premium}` : 0}&nbsp;<span className="unit">HMSTR</span></div>
          </div>
        </div>
      </div>
      <Popup
        visible={isShowRules}
        onMaskClick={() => {
          setShowRules(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        className='popup-rule'
      >
        <div className='popup-rule-content'>
          <div className='popup-rule-title'>
            <div>Rules</div>
            <svg onClick={() => setShowRules(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="18" height="18"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#000" p-id="5778"></path></svg>
          </div>
          <div className='popup-rule-wrapper'>
            <div className='popup-rule-content'>
              <div className='popup-rule-content-title'>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5414" width="16" height="16"><path d="M845.902988 0.000232H178.097244A177.864812 177.864812 0 0 0 0.000232 178.097244v667.805744a177.864812 177.864812 0 0 0 178.097012 178.097012h667.805744a177.864812 177.864812 0 0 0 178.097012-178.097012V178.097244A177.864812 177.864812 0 0 0 845.902988 0.000232zM512.000116 911.615445A75.929234 75.929234 0 1 1 587.929351 835.91841a77.090232 77.090232 0 0 1-75.929235 75.697035z m75.929235-340.172258v51.548287a75.929234 75.929234 0 0 1-151.858469 0v-114.938749a75.697035 75.697035 0 0 1 75.929234-75.929235A84.056217 84.056217 0 1 0 428.176099 348.299473a76.161434 76.161434 0 1 1-152.090669 0 235.914686 235.914686 0 1 1 311.843921 223.375913z" fill="#000" p-id="5415"></path></svg>
                How to Earn
                <img src='/assets/logo.png' alt='logo' width={16} height={16} />
              </div>
              <ul>
                <li>Check in daily to get <img src='/assets/logo.png' alt='logo' width={16} height={16} /> and an additional <img src='/assets/logo.png' alt='logo' width={16} height={16} /> if you do it consecutively!</li>
                <li>Check in daily to receive <img src='/assets/common/ticket.webp' alt='logo' width={16} height={16} /> and earn more <img src='/assets/logo.png' alt='logo' width={16} height={16} />.</li>
                <li>Invite frens to earn more <img src='/assets/logo.png' alt='logo' width={16} height={16} />,Get 10% of Your Fren's  unit Yields in Rewards
                </li>
                <li>Play games to earn more <img src='/assets/logo.png' alt='logo' width={16} height={16} />.</li>
                <li>
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3174" data-spm-anchor-id="a313x.search_index.0.i5.2b3c3a81TUgFeH" width="16" height="16"><path d="M42.666667 896l938.666667 0-469.333333-810.666667-469.333333 810.666667zM554.666667 768l-85.333333 0 0-85.333333 85.333333 0 0 85.333333zM554.666667 597.333333l-85.333333 0 0-170.666667 85.333333 0 0 170.666667z" fill="#ecc115" p-id="3175" data-spm-anchor-id="a313x.search_index.0.i0.2b3c3a81TUgFeH" ></path></svg>
                  &nbsp;<img src='/assets/common/ticket.webp' alt='logo' width={16} height={16} /> will be reset at 00:00 AM (UTC+0) every day!</li>
              </ul>
            </div>
          </div>
        </div>
      </Popup>
      <Modal
        visible={visible}
        content={<AirDrop />}
        closeOnAction
        closeOnMaskClick
        onClose={() => {
          setVisible(false)
        }}

        actions={[
          {
            key: 'confirm',
            text: 'Get More',
          },
        ]}
      />
      <BackTop />
    </main>
  )
}

const AirDrop: FC = () => {
  return <div className='airdrop'>
    <div className='airdrop-inner'>
      <div className='title'>Airdrop is Coming!</div>
      <div className='p-wrapper'>
        <ProgressCircle
          percent={64}
          style={{
            '--size': '110px',
            '--track-width': '4px',
          }}
        >
          <div className={'p-title'}>Total Supply</div>
          <div className={'p-total'}>100</div>
          <div className={'p-unit'}>Billion</div>
        </ProgressCircle>
      </div>
      <div className='p-desc'>In the first season, we generously distributed <b>64.3 billion HMSTR</b> tokens to 56 million users as a preliminary gift for our community building. As the project continues to develop, we are excited to announce that the second season will airdrop another <b>30 billion HMSTR</b> tokens to our users. We sincerely invite every user to join this exciting journey and witness and participate in the growth and prosperity of our project together. Take immediate action, seize the opportunity, <b>let's work together to create a brilliant future</b>!
      </div>
    </div>
  </div>
}
var videoIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22188" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M509.866667 32C245.333333 32 32 247.466667 32 512s213.333333 480 477.866667 480c264.533333 0 477.866667-215.466667 477.866666-480S774.4 32 509.866667 32z m0 896C281.6 928 96 742.4 96 512S281.6 96 509.866667 96 923.733333 281.6 923.733333 512s-185.6 416-413.866666 416z" fill="#ffffff" p-id="22189"></path><path d="M433.066667 354.133333c-6.4-4.266667-17.066667 0-17.066667 10.666667V661.333333c0 8.533333 8.533333 14.933333 17.066667 10.666667l234.666666-149.333333c6.4-4.266667 6.4-14.933333 0-19.2l-234.666666-149.333334z" fill="#ffffff" p-id="22190"></path></svg>

