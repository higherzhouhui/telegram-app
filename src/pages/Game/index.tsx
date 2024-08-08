import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame';
import './index.scss'
import { Popup, Toast } from 'antd-mobile';
import { initUtils, initBackButton } from '@telegram-apps/sdk';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { beginGameReq, endGameReq } from '@/api/game';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import EventBus from '@/utils/eventBus';
function GamePage() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [currentScene, setCurrentScene] = useState('Preloader')
  const [score, setScore] = useState(0)
  const [link, setLink] = useState('https://t.me/frenpetgame_bot/forkfrengame')
  const [showPopUp, setShowPopUp] = useState(false)
  const [backButton] = initBackButton();
  const utils = initUtils()
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.info);
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance()

  // Event emitted from the PhaserGame component
  const currentActiveScene = async (scene: Phaser.Scene) => {
    setCurrentScene(scene.scene.key);
    if (scene.scene.key == 'GameOver') {
      eventBus.emit('showCongrates', true)
      const _score = (localStorage.getItem('currentScore') || 0) as any
      setScore(_score as any)
      endGameReq({ score: _score * 1 }).then(res => {
        if (res.code == 0) {
          dispatch(setUserInfoAction(res.data))
        }
      }).catch(error => {
        console.error(error)
      })
      backButton.show();
    } else {
      backButton.hide();
    }
    if (scene.scene.key == 'MainGame') {
      const res = await beginGameReq()
      if (res.code != 0) {
        navigate(-1)
      } else {
        dispatch(setUserInfoAction(res.data))
      }
    }
  }

  const restartGame = () => {
    if (userInfo.ticket == 0) {
      Toast.show({ content: '0 Attempts Left', position: 'top' })
      return
    }
    phaserRef?.current?.game?.scene?.start('MainGame')
  }

  const shareResult = () => {
    setShowPopUp(true)
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
    const text = `I scored ${score} points in Tomato Game!\n
                  I dare you to challenge me!\n
                  Farm 🍅 $TOMATO with me and secure your token allocation through Tomarket.ai.\n
                  Use my link to get 2,000 🍅 $TOMATO!`
    utils.shareURL(link, text)
  }

  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
  }, [])


  return (
    <div className='game-wrapper'>
      {
        currentScene == 'Preloader' ? <div className='loading'>
          <img src='/assets/loading.gif' />
        </div> : null
      }
      {
        currentScene == 'GameOver' ? <div className='game-over'>
          <div className='game-over-top'>
            <img src='/assets/hooray-8Kybc2vw.gif' alt='gif' className='congrats-img' />
            <div className='congrats'>Congrats!</div>
            <div className='congrats'>bountiful harvest</div>
            <div className='score-wrapper'>
              <span>+</span>
              <span>{score} </span>
              <img src="/assets/tomato-32x32.webp" alt="tomato" />
            </div>
          </div>
          <div className='game-over-bot'>
            <div className='game-over-btn' onClick={() => shareResult()}>
              <img src="/assets/kid-cYicWGds.webp" alt="avatar" className='avatar' />
              <div className='game-over-bot-middle'>
                Share Your Results +50
                <img src="/assets/tomato-32x32.webp" alt="tomato" className='tomato' />
              </div>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3559" width="26" height="26"><path d="M384 768 640 512 384 256Z" p-id="3560"></path></svg>
            </div>
            <div className='game-over-btn' style={{ background: '#333' }} onClick={() => restartGame()}>
              <div className='game-over-bot-middle'>Play ({userInfo.ticket} Attempts Left)</div>
            </div>
          </div>
        </div> : null
      }
      <PhaserGame ref={phaserRef} currentActiveScene={currentActiveScene} />
      <Popup
        visible={showPopUp}
        onMaskClick={() => {
          setShowPopUp(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}>
        <div className='popup-result'>
          <div className='popup-title'>
            Share Results
            <svg onClick={() => setShowPopUp(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="16" height="16"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#272636" p-id="5778"></path></svg>
          </div>
          <div className='popup-content'>
            <div className='popup-content-jb'>🏆</div>
            <div className='score-wrapper'>
              <span>+</span>
              <span>{score} </span>
              <img src="/assets/tomato-32x32.webp" alt="tomato" />
            </div>
            <div>I scored {score} points in Tomato Game!</div>
            <div>I dare you to challenge me!</div>
            <div className='popup-content-btn' onClick={() => handleCopyLink()}>Copy link</div>
            <div className='popup-content-btn btn-send' onClick={() => handleSendLink()}>Send</div>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default GamePage
