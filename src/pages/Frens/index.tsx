import { getSubUserListReq } from "@/api/common";
import { stringToColor } from "@/utils/common";
import { initUtils } from "@telegram-apps/sdk";
import { Button, InfiniteScroll, List } from "antd-mobile";
import { useState } from "react";
import { useSelector } from "react-redux";
import LogoIcon from '@/assets/logo.jpg'
import './index.scss'
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const userInfo = useSelector((state: any) => state.user.info);
  const utils = initUtils()
  const [isCopy, setIsCopy] = useState(false)
  const link = `https://t.me/HamstersTon_bot/Hamster?startapp=${btoa(userInfo.user_id)}`;
  const [friendsList, setFriendsList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()
  async function loadMore() {
    const append = await getList()
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setFriendsList(append)
    } else {
      setFriendsList(val => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  const getList = async () => {
    const res = await getSubUserListReq({ page })
    setTotal(res.data.count)
    setPage((page => page + 1))
    return res.data.rows
  }
  const handleShare = () => {
    /**
     * 🔥🐹🔥 Come to Earn the Hottest Telegram MEMEcoin here! 💸🏆💰
I've found a platform where you can launch your meme coins. Check out your Telegram profile and claim your HAMSTER rewards🎁 now!👆🏻 ❤️
     */
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
  return <div className="friends fadeIn">
    <div className="friends-title">
      <div>Invite Frens</div>
      <div>and get more Hamsters</div>
    </div>
    <div className="logo">
      <img src={LogoIcon} alt="logo" style={{ width: '40vw', objectFit: 'contain' }} />
    </div>
    <div className="friends-list-wrapper">

      {
        !total ? <div className="tap-desc">Tap on the button to invite your friends</div> : <div className="friends-list-title">
          <div className="ft-left">{total}&nbsp;&nbsp;frens</div>
          <svg onClick={() => navigate(`/detail?total=${total}`)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2628" width="22" height="22"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#e6e6e6" p-id="2629"></path><path d="M512 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#e6e6e6" p-id="2630"></path><path d="M341.333333 512m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#e6e6e6" p-id="2631"></path><path d="M682.666667 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#e6e6e6" p-id="2632"></path></svg>
        </div>
      }
      <List>
        {
          friendsList.map((item, index) => {
            return <List.Item key={index}>
              <div className="friends-list" key={index}>
                <div className="fl-left">
                  <div className="icon" style={{ background: stringToColor(item.from_username || 'cc') }}>
                    {
                      (item.from_username || 'cc').slice(0, 2)
                    }
                  </div>
                  <div className="name">{item.from_username || 'cc'}</div>
                </div>
                <div className="fl-right">
                  +{item.score}&nbsp;Hamsters
                </div>
              </div>
            </List.Item>
          })
        }
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} children={<div></div>} />
    </div>
    <div className="invite-btn">
      <Button color="default" style={{ fontWeight: 'bold', flex: 1 }} onClick={() => handleShare()}>👆🏻 Invite friends</Button>
      <Button color="default" className="copy" onClick={() => copy()}>
        {
          isCopy ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3786" width="18" height="18"><path d="M416.832 798.08C400.64 798.08 384.512 791.872 372.16 779.52L119.424 525.76C94.784 500.992 94.784 460.8 119.424 436.032 144.128 411.264 184.128 411.264 208.768 436.032L416.832 644.928 814.4 245.76C839.04 220.928 879.04 220.928 903.744 245.76 928.384 270.528 928.384 310.656 903.744 335.424L461.504 779.52C449.152 791.872 432.96 798.08 416.832 798.08Z" fill="#272636" p-id="3787"></path></svg> : <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="18" height="18"><path d="M878.272 981.312H375.36a104.64 104.64 0 0 1-104.64-104.64V375.36c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v502.912c-1.6 56.192-48.448 103.04-104.64 103.04z m-502.912-616.96a10.688 10.688 0 0 0-10.944 11.008v502.912c0 6.208 4.672 10.88 10.88 10.88h502.976c6.208 0 10.88-4.672 10.88-10.88V375.36a10.688 10.688 0 0 0-10.88-10.944H375.36z" fill="#2c2c2c" p-id="2453"></path><path d="M192.64 753.28h-45.312a104.64 104.64 0 0 1-104.64-104.64V147.328c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v49.92a46.016 46.016 0 0 1-46.848 46.912 46.08 46.08 0 0 1-46.848-46.848v-49.984a10.688 10.688 0 0 0-10.944-10.944H147.328a10.688 10.688 0 0 0-10.944 10.88v502.976c0 6.208 4.672 10.88 10.88 10.88h45.312a46.08 46.08 0 0 1 46.848 46.912c0 26.496-21.824 45.248-46.848 45.248z" fill="#2c2c2c" p-id="2454"></path></svg>
        }
      </Button>
    </div>
  </div>
}