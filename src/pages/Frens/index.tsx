import { useEffect, useState } from 'react'
import './index.scss'
import { getSystemConfigReq, getSubUserTotalReq } from '@/api/common'
import Loading from '@/components/Loading'
import { Button } from 'antd-mobile'
import { useSelector } from 'react-redux'
import { initUtils } from '@telegram-apps/sdk'
import { useNavigate } from 'react-router-dom'
import loginConfig from "@/constants/config/login.config";

function FrensPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const utils = initUtils()
  const [isCopy, setIsCopy] = useState(false)
  const link = `${loginConfig.TG_LINK}?startapp=${btoa(userInfo.user_id)}`;
  const [systemConfig, setSystemConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const initSystemConfig = async () => {
    setLoading(true)
    const [res, resTotal] = await Promise.all([getSystemConfigReq(), getSubUserTotalReq()])
    setSystemConfig(res.data)
    setTotal(resTotal.data.total)
    setLoading(false)
  }
  const routeToDetail = () => {
    navigate(`/frens-detail?total=${total}`)
  }
  const handleShare = () => {
    utils.shareURL(link, ``)
  }
  const copy = () => {
    const textToCopy = link; // 替换为你想要复制的内容  
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setIsCopy(true)
    setTimeout(() => {
      setIsCopy(false)
    }, 3000);
  }

  useEffect(() => {
    initSystemConfig()
  }, [])
  return <div className='frens-page fadeIn'>
    <div className='frens-page-top'>
      <div className='frens-title'>
        <img src="/assets/user-friends.png" alt="friends" />
        <div className='invite-earn'>Invite to Earn</div>
        <div className='frens-unit'>$TOMATO</div>
      </div>
      {
        total ? <div className='sub-container' onClick={() => routeToDetail()}>
          <div className='total'>{total}</div>
          <div className='frens'>Frens</div>
          <div className='view-frens'>View Frens Detail&nbsp;&nbsp;&gt;</div>
        </div> : null
      }
      <div className='rules-container'>
        <div className='rules-title'>Referral Rules</div>
        <div className='rules-content'>
          <div className='rules-list'>
            <div className='rules-list-title'>Invite a Friends</div>
            <div className='rules-desc'>
              You will both get {systemConfig?.invite_normalAccount_score}
              &nbsp;<img src="/assets/tomato-32x32.webp" alt="unit" />
              &nbsp;and {systemConfig?.invite_normalAccount_ticket}
              &nbsp;<img src="/assets/ticket-32x32.webp" alt="unit" />.
            </div>
          </div>
          <div className='rules-list'>
            <div className='rules-list-title'>Invite a Friends with a Telegram Premium Account</div>
            <div className='rules-desc'>
              You will both get {systemConfig?.invite_premiumAccount_score}
              &nbsp;<img src="/assets/tomato-32x32.webp" alt="unit" />
              &nbsp;and {systemConfig?.invite_premiumAccount_ticket}
              &nbsp;<img src="/assets/ticket-32x32.webp" alt="unit" />.
            </div>
          </div>
          <div className='rules-list'>
            <div className='rules-list-title'>Additional Incentives</div>
            <div className='rules-desc'>
              Get {systemConfig?.invite_friends_ratio}% of Your Fren's
              &nbsp;<img src="/assets/tomato-32x32.webp" alt="unit" />
              &nbsp;Yields in Rewards
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='page-bottom'>
      <Button color="default" style={{ fontWeight: 'bold', flex: 1, background: '#000', color: '#fff' }} onClick={() => handleShare()}>👆🏻 Invite frens</Button>
      <Button color="default" className="copy" onClick={() => copy()}>
        {
          isCopy ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3786" width="18" height="18"><path d="M416.832 798.08C400.64 798.08 384.512 791.872 372.16 779.52L119.424 525.76C94.784 500.992 94.784 460.8 119.424 436.032 144.128 411.264 184.128 411.264 208.768 436.032L416.832 644.928 814.4 245.76C839.04 220.928 879.04 220.928 903.744 245.76 928.384 270.528 928.384 310.656 903.744 335.424L461.504 779.52C449.152 791.872 432.96 798.08 416.832 798.08Z" fill="#272636" p-id="3787"></path></svg> : <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="18" height="18"><path d="M878.272 981.312H375.36a104.64 104.64 0 0 1-104.64-104.64V375.36c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v502.912c-1.6 56.192-48.448 103.04-104.64 103.04z m-502.912-616.96a10.688 10.688 0 0 0-10.944 11.008v502.912c0 6.208 4.672 10.88 10.88 10.88h502.976c6.208 0 10.88-4.672 10.88-10.88V375.36a10.688 10.688 0 0 0-10.88-10.944H375.36z" fill="#2c2c2c" p-id="2453"></path><path d="M192.64 753.28h-45.312a104.64 104.64 0 0 1-104.64-104.64V147.328c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v49.92a46.016 46.016 0 0 1-46.848 46.912 46.08 46.08 0 0 1-46.848-46.848v-49.984a10.688 10.688 0 0 0-10.944-10.944H147.328a10.688 10.688 0 0 0-10.944 10.88v502.976c0 6.208 4.672 10.88 10.88 10.88h45.312a46.08 46.08 0 0 1 46.848 46.912c0 26.496-21.824 45.248-46.848 45.248z" fill="#2c2c2c" p-id="2454"></path></svg>
        }
      </Button>
    </div>
  </div>
}

export default FrensPage;