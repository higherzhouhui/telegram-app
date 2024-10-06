import './index.scss'
import { Modal, NoticeBar, Popup, Toast } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initUtils } from '@telegram-apps/sdk';
import { useCallback, useEffect, useState } from 'react';
import { stringToColor } from '@/utils/common';
import { getGameInfoReq } from '@/api/game';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import { useAdsgram } from '@/hooks/useAdsgram';


export default function () {
  const userInfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const [gameInfo, setGameInfo] = useState<any>({})
  const link = `https://t.me/HamstersTon_bot/Hamster?startapp=${btoa(userInfo.user_id)}`;
  const [isShowInvite, setShowInvite] = useState(false)
  const utils = initUtils()
  const [content, setContent] = useState('')
  const systemInfo = useSelector((state: any) => state.user.system)
  const hapticFeedback = useHapticFeedback()

  const onReward = useCallback(() => {
    alert('Reward');
  }, []);
  const onError = useCallback((result: any) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "3913", onReward, onError });

  const handlePlayGame = (link: string) => {
    if (userInfo?.ticket > 0) {
      navigate(link)
      hapticFeedback.notificationOccurred('success')
    } else {
      showAd()
      return
      setShowInvite(true)
      hapticFeedback.notificationOccurred('warning')
    }
  }

  const handleNotice = () => {
    Modal.show({
      title: 'Game rewards',
      content: content,
      closeOnMaskClick: true,
      image: '/assets/rewards.png'
    })
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

  useEffect(() => {
    getGameInfoReq().then(res => {
      if (res.code == 0) {
        setGameInfo(res.data)
        let _content = ''
        res.data.list.map((item: any) => {
          _content += item.desc
          _content += '.  '
        })
        _content += 'Participating in games has a better chance of winning mysterious prizes!'
        setContent(_content)
      }
    })
  }, [])

  return <div className='gamepage-container fadeIn'>
    <NoticeBar content={content} color='info' onClick={() => handleNotice()} />
    <div className='g-container'>
      <div className='title' onClick={() => navigate('/gameleaderboard')}>
        <div className='left'>ᴘʟᴀʏ ɢᴀᴍᴇ ᴛᴏ ᴇᴀʀɴ $ʜᴍsᴛʀ</div>
        <div className='right'>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4873" width="24" height="24"><path d="M642.174253 504.59418C650.164439 511.835287 650.070886 522.174253 641.84009 529.376198L332.618569 799.94503C323.751654 807.703582 322.853148 821.181184 330.611697 830.048098 338.370249 838.915012 351.847851 839.813519 360.714765 832.05497L669.936288 561.486138C697.36486 537.486138 697.727953 497.358861 670.825747 472.978737L360.992414 192.192278C352.26205 184.280386 338.770837 184.943889 330.858944 193.674252 322.947053 202.404616 323.610556 215.895829 332.340919 223.807723L642.174253 504.59418Z" fill="#fff" p-id="4874"></path></svg>
        </div>
      </div>
      <div>
        <div className="myself" onClick={() => navigate('/gameleaderboard')}>
          <div className="left">
            <div className="icon" style={{ background: stringToColor(userInfo?.username) }}>
              {userInfo?.username?.slice(0, 2)}
            </div>
            <div className="name-score-warpper">
              <div className="name">{userInfo?.username}</div>
              <div className="name-score">Game:&nbsp;{userInfo?.game_score?.toLocaleString()}&nbsp;$HMSTR</div>
              <div className="name-score">Times:&nbsp;{gameInfo?.count}&nbsp;</div>
            </div>
          </div>
          <div className="right">
            {
              gameInfo?.rank == 1 ? <img src='/assets/common/NO1.png' alt="no1" /> : gameInfo?.rank == 2 ? <img src='/assets/common/NO2.png' alt="no2" /> : gameInfo?.rank == 3 ? <img src='/assets/common/NO3.png' alt="no3" /> : gameInfo?.rank == 4 ? <img src='/assets/common/NO4.png' alt="no4" /> : gameInfo?.rank == 5 ? <img src='/assets/common/NO5.png' alt="no5" /> : <span>#{gameInfo?.rank}</span>
            }
          </div>
        </div>
      </div>
      <div className='intros'>
        <div className='intro-list'>
          <img src='/assets/g1.png' />
          <div className='btn' onClick={() => handlePlayGame('/emoji')}>
            <span>Play</span>
            <span>
              {userInfo?.ticket}
            </span>
            <img src='/assets/common/ticket.png' className='ticket' />
          </div>
        </div>

        <div className='intro-list'>
          <img src='/assets/wel.gif' />
          <div className='btn' onClick={() => handlePlayGame('/fall')}>
            <span>Play</span>
            <span>
              {userInfo?.ticket}
            </span>
            <img src='/assets/common/ticket.png' className='ticket' />
          </div>
        </div>

        <div className='intro-list'>
          <img src='/assets/g3.png' />
          <div className='btn' onClick={() => handlePlayGame('/memory')}>
            <span>Play</span>
            <span>
              {userInfo?.ticket}
            </span>
            <img src='/assets/common/ticket.png' className='ticket' />
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
              <div>Get {systemInfo?.invite_add} $HMSTR and {systemInfo?.ticket} ticket（Invite a Friend）</div>
              <div>Get {systemInfo?.huiYuan_add} $HMSTR and {systemInfo?.huiYuan_ticket} tickets（Invite a Telegram Premium）</div>
            </div>
            <div className='popup-content-btn' onClick={() => handleCopyLink()}>Copy link</div>
            <div className='popup-content-btn btn-send' onClick={() => handleSendLink()}>Send</div>
          </div>
        </div>
      </Popup>
    </div>
  </div>
}