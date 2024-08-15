import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import './index.scss'
import { Button } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { formatWalletAddress, handleCopyLink } from '@/utils/common';

function WalletPage() {
  const { connectWallet, isConnected } = useConnectWallet();
  const userInfo = useSelector((state: any) => state.user.info);
  const onConnectBtnClickHandler = async () => {
    try {
      await connectWallet();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return <div className='wallet-page fadeIn'>
    <img src="/assets/wallet-logo.png" alt="wallet" />
    <div className='wallet-page-title'>The time has come.</div>
    <div className='connect-wrapper'>
      <img src="/assets/connection.png" alt="wallet" width={24} />
      <div className='connect-desc'>Connect your PortKey Wallet</div>
      <div className='connect-intro'>The best Wallet to Explore TON Ecosystem</div>
      {
        isConnected ? <div className='wallet-address' onClick={() => handleCopyLink(userInfo.wallet)}>{formatWalletAddress(userInfo.wallet)}</div> : <Button onClick={onConnectBtnClickHandler} style={{ marginTop: '1rem' }}>connect</Button>
      }
    </div>
    <div className='happing'>What's happening?</div>
    <div className='activity'>Somethings <span>HUGE</span> is coming in Oct.</div>
    <div className='activity'>connecting PortKey Wallet is the <span>first step</span>. Do not be late.</div>
  </div>
}

export default WalletPage