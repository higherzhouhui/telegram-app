import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import './index.scss'
import { Button, Dialog } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { formatWalletAddress, handleCopyLink } from '@/utils/common';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';


function WalletPage() {
  const router = useNavigate()
  const [isH5PcRoot, setH5PcRoot] = useState(false)
  const { connectWallet, isConnected, disConnectWallet, walletInfo, isLocking, lock, walletType } = useConnectWallet();
  const userInfo = useSelector((state: any) => state.user.info);
  const [hasToken, setHasToken] = useState(true)
  const timer = useRef<any>(null)
  const timer1 = useRef<any>(null)
  const onConnectBtnClickHandler = async () => {
    try {
      await connectWallet();
    } catch (e: any) {
      const msg = e?.nativeError?.message || e?.message
      Dialog.alert({
        content: `${msg}`,
        confirmText: 'I Know',
        onConfirm: () => {

        },
      })
    }
  };

  const handleAsset = async () => {
    router('/assets')
  }

  useEffect(() => {
    if (localStorage.getItem('h5PcRoot') == '1') {
      setH5PcRoot(true)
    }

  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    clearTimeout(timer1.current)
    if (!localStorage.getItem('authorization')) {
      setHasToken(false)
    } else {
      setHasToken(true)
    }
    if (localStorage.getItem('h5PcRoot') == '1') {
      timer.current = setTimeout(() => {
        if (!isConnected && !walletInfo && !isLocking) {
          timer1.current = setTimeout(() => {
            if (isH5PcRoot) {
              localStorage.removeItem('authorization')
              localStorage.removeItem('walletInfo')
            }
            onConnectBtnClickHandler()
          }, 500);
        }
      }, 500);
      return () => {
        clearTimeout(timer.current)
        clearTimeout(timer1.current)
      }
    }
  }, [isConnected, walletInfo, isLocking])

  return <div className='wallet-page fadeIn'>
    <img src="/assets/wallet-1.png" alt="wallet" className='wallet-img' />
    <div className='wallet-page-title'>The time has come.</div>
    <div className='connect-wrapper'>
      <img src="/assets/money.png" alt="wallet" width={32} />
      {
        isConnected && userInfo?.wallet && hasToken ? <div>
          <div className='connect-desc'>The best Wallet to Explore AELF Ecosystem</div>
          <div className='connect-assets'>
            <div className='my-assets' onClick={() => handleCopyLink(userInfo.wallet, 'The address has been copied to the clipboard.')}>
              <div className='label'>Your wallet address:{formatWalletAddress(userInfo.wallet)}</div>
              <div className='value'>Copy</div>
            </div>

            {
              walletType == "PortkeyAA" ? <div className='my-assets' onClick={() => handleAsset()}>
                <div className='label'>Your Assets</div>
                <div className='value'>Assets</div>
              </div> : <div></div>
            }
            {
              isH5PcRoot ? <>
                {
                  walletType == 'PortkeyAA' ? <>
                    <div className='my-assets' onClick={lock}>
                      <div className='label'>Lock wallet</div>
                      <div className='value'>{isLocking ? 'unLock' : 'Lock'}</div>
                    </div>
                    <div className='my-assets' onClick={async () => await disConnectWallet()}>
                      <div className='label'>Disconnect/Switch Wallet</div>
                      <div className='value'>Disconnect</div>
                    </div>
                  </> : <div className='my-assets' onClick={async () => await disConnectWallet()}>
                    <div className='label'>Disconnect/Switch Wallet</div>
                    <div className='value'>Disconnect</div>
                  </div>
                }
              </> : <div></div>
            }

          </div>
        </div> : <>
          <div className='connect-desc'>Connect your PortKey Wallet</div>
          <div className='connect-intro'>The best Wallet to Explore AELF Ecosystem</div>
          <Button onClick={onConnectBtnClickHandler} style={{ marginTop: '1rem', background: 'var(--btnBg)', border: 'none' }}>
            {isLocking ? 'UnLock' : 'Connect'}
          </Button>
        </>
      }
    </div>
    <div className='happing'>Earn $CAT for Potential On-Chain Rewards</div>
    <div className='activity'>●Tap to earn $CAT easily.</div>
    <div className='activity'>●Farm $CAT to increase your returns.</div>
    <div className='activity'>●Compete on the leaderboard to gain $CAT rewards.</div>
    <div className='activity'>●Invite friends to boost your $CAT earnings.</div>
    <div className='happing' style={{ marginTop: '12px' }}>$CAT may potentially be converted into valuable on-chain tokens.</div>
  </div>
}

export default WalletPage