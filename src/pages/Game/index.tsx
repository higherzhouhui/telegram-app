import { Popup, Toast } from 'antd-mobile';
import './index.scss'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initUtils } from '@telegram-apps/sdk';
import { useState } from 'react';

export default function () {
  const userInfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const link = `https://t.me/HamstersTon_bot/Hamster?startapp=${btoa(userInfo.user_id)}`;
  const [isShowInvite, setShowInvite] = useState(false)
  const utils = initUtils()
  const systemInfo = useSelector((state: any) => state.user.system)
  const handlePlayGame = (link: string) => {
    if (userInfo?.ticket > 0) {
      navigate(link)
    } else {
      setShowInvite(true)
    }
  }

  const handleCopyLink = () => {
    const textToCopy = link; // 替换为你想要复制的内容  
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    Toast.show({ content: 'copied', position: 'top' })
  }

  const handleSendLink = () => {
    const text = `Hey, if you're a Pig, DOGS, Blum or Catizen user... you have something very special to claim in the Hamster app now.\nThe Hamster airdrop is coming! 🪂\nClaim with this link.`
    utils.shareURL(link, text)
  }

  return <div className='gamepage-container fadeIn'>
    <div className='title'>Play games to earn $Hamster</div>
    <div className='intros'>
      <div className='intro-list'>
        <img src='/assets/g1.png' />
        <div className='btn' onClick={() => handlePlayGame('/emjoyGame')}>
          <span>Play Game</span>
          <span>
            {userInfo?.ticket}
          </span>
          <img src='/assets/common/ticket.webp' className='ticket' />
        </div>
      </div>
      <div className='intro-list'>
        <img src='/assets/wel.gif' />
        <div className='btn' onClick={() => handlePlayGame('/downGame')}>
          <span>Play Game</span>
          <span>
            {userInfo?.ticket}
          </span>
          <img src='/assets/common/ticket.webp' className='ticket' />
        </div>
      </div>
    </div>

    <Popup
      visible={isShowInvite}
      onMaskClick={() => {
        setShowInvite(false)
      }}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      className='popup-invite'
    >
      <div className='popup-frens'>
        <div className='title'>
          Invite a Fren
          <svg onClick={() => setShowInvite(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="18" height="18"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#272636" p-id="5778"></path></svg>
        </div>
        <div className='content'>
          <div className='content-desc'>
            <div>Get {systemInfo?.invite_add} $Hamster and {systemInfo?.ticket} ticket（Invite a Friend）</div>
            <div>Get {systemInfo?.huiYuan_add} $Hamster and {systemInfo?.huiYuan_ticket} tickets（Invite a Telegram Premium）</div>
          </div>
          <div className='popup-content-btn' onClick={() => handleCopyLink()}>Copy link</div>
          <div className='popup-content-btn btn-send' onClick={() => handleSendLink()}>Send</div>
        </div>
      </div>
    </Popup>

  </div>
}