import { useSelector } from 'react-redux';
import './index.scss'
import { useEffect, useState } from 'react';
import { Input, Popup, Toast } from 'antd-mobile';
import { initUtils } from '@telegram-apps/sdk';

function AirDropPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const hmstr = useSelector((state: any) => state.user.hmstr);
  const [detail, setDetail] = useState<any>([])
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [uid, setUid] = useState('')
  const [address, setAddress] = useState('')
  const [memo, setMemo] = useState('')

  const utils = initUtils()

  const withDrawList = [
    { logo: '/assets/okx.png', name: 'OKX Exchange', url: 'https://www.okx.com/', type: 'okx', desc: 'Unlock new trading possibilities with OKX. Trusted by traders worldwide-trade anytime, from anywhere' },
    { logo: '/assets/binance.png', name: 'BINANCE Exchange', url: 'https://www.binance.com/', type: 'binance' },
    { logo: '/assets/wallet.png', name: 'Wallet in Telegram', url: '', type: 'wallet' },
  ]


  const progressList = [
    {
      label: 'October 24 2024, 06:00 PM UTC - Deposit start',
      active: true,
    },
    {
      label: 'October 28 2024, 09:00 AM UTC - Deposit end',
      active: false,
    },
    {
      label: 'October 28 2024, 06:00 PM UTC - confirmation/decline',
      active: false,
    },
    {
      label: `October 29 2024, 12:00 AM UTC - You'll get your Airdrop`,
      active: false,
    }
  ]
  const handleOption = (index: number) => {
    setCurrent(index)
    setVisible(true)
  }

  const handleToRegister = () => {
    utils.openLink(withDrawList[current].url)
  }

  useEffect(() => {
    if (userInfo) {
      const list = [
        { label: 'Account', score: userInfo.account_age_score + userInfo.telegram_premium },
        { label: 'Check-In', score: userInfo.check_score },
        { label: 'Game', score: userInfo.game_score },
        { label: 'Friends', score: userInfo.score - userInfo.account_age_score - userInfo.telegram_premium - userInfo.check_score - userInfo.game_score },
      ]
      setDetail(list)
    }
  }, [userInfo])

  return <div className='airdrop-page'>
    {/* <div className='title'>Airdrop</div> */}
    <div className='title'>Snapshot</div>
    <div className='time'>Until October 24, 2024. 12:00 UTC</div>
    <div className='have'>
      <div className='have-title'>You have</div>
      <div className='balance'>{userInfo?.score?.toLocaleString()} $HMSTR</div>
      <div className='money'>&asymp; {Math.round(userInfo?.score * hmstr.price)} $</div>
      <div className='detail'>Details:</div>
      {
        detail.map((item: any, index: number) => {
          return <div key={index} className={`detail-item detail-item${item.score}`}>
            <div className='left'>{item.label}</div>
            <div className='right'>{item?.score?.toLocaleString()}</div>
          </div>
        })
      }
    </div>
    <div className='option'>Choose withdrawal option:</div>
    {
      withDrawList.map((item: any, index: number) => {
        return <div className='option-list' key={index} onClick={() => handleOption(index)}>
          <div className='left'>
            <img src={item.logo} alt='logo' />
            <div className='name'>{item.name}</div>
          </div>
          <div className='right'>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3115" width="16" height="16"><path d="M704 514.368a52.864 52.864 0 0 1-15.808 37.888L415.872 819.2a55.296 55.296 0 0 1-73.984-2.752 52.608 52.608 0 0 1-2.816-72.512l233.6-228.928-233.6-228.992a52.736 52.736 0 0 1-17.536-53.056 53.952 53.952 0 0 1 40.192-39.424c19.904-4.672 40.832 1.92 54.144 17.216l272.32 266.88c9.92 9.792 15.616 23.04 15.808 36.8z" fill="#e6e6e6" fill-opacity=".88" p-id="3116"></path></svg>
          </div>
        </div>
      })
    }
    <Popup
      visible={visible}
      onMaskClick={() => {
        setVisible(false)
      }}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      className='popup-airdrop'
    >
      <div className='airdrop-content'>
        <div className='close' onClick={() => setVisible(false)}>
          <svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4144" width="26" height="26"><path d="M513.344 0a512 512 0 1 0 0 1024 512 512 0 0 0 0-1024z m226.048 674.624l-54.528 56.896-171.52-164.928-171.392 164.928-54.592-56.896L456.576 512 287.36 349.312l54.592-56.768 171.392 164.8 171.52-164.8 54.528 56.768L570.176 512l169.216 162.624z" fill="#e6e6e6" p-id="4145"></path></svg>
        </div>
        <div className='title'>
          <img src={withDrawList[current].logo} className='logo' />
          <div className='title-name'>{withDrawList[current].name}</div>
        </div>
        <div className='desc'>{withDrawList[current].desc}</div>
        <div className='btn' onClick={() => handleToRegister()}>
          Register
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2284" width="14" height="14"><path d="M400 876.8l339.2-339.2v-44.8L400 156.8l-44.8 44.8 313.6 313.6-313.6 316.8z" fill="#000000" p-id="2285"></path></svg>
        </div>
        {
          progressList.map((item: any, index: number) => {
            return <div className='time-list' key={index}>{item.label}</div>
          })
        }
        <div className='input-wrapper'>
          <div className='label'>OKX UID:</div>
          <Input
            placeholder='Please Input'
            value={uid}
            onChange={(e) => setUid(e)}
            style={{ background: '#222', padding: '12px 6px', marginTop: '10px', borderRadius: '6px', '--color': '#fff', '--font-size': '1rem' }}
          />
        </div>
      </div>
    </Popup>
  </div>
}

export default AirDropPage;