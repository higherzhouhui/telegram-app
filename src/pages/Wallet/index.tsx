import './index.scss'

export default function () {

  return <div className='wallet-page fadeIn'>
    <img src="/assets/wallet-logo.png" alt="wallet" />
    <div className='wallet-page-title'>The time has come.</div>
    <div className='connect-wrapper'>
      <img src="/assets/connection.png" alt="wallet" width={24} />
      <div className='connect-desc'>Connect your PortKey Wallet</div>
      <div className='connect-intro'>The best Wallet to Explore TON Ecosystem</div>
    </div>
    <div className='happing'>What's happening?</div>
    <div className='activity'>Somethings <span>HUGE</span> is coming in Oct.</div>
    <div className='activity'>connecting PortKey Wallet is the <span>first step</span>. Do not be late.</div>
  </div>
}