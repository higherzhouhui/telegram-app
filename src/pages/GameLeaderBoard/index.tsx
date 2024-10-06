import { getUserGameListReq } from '@/api/common'
import { formatNumber, stringToColor } from '@/utils/common'
import { List, InfiniteScroll, Popup } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './index.scss'
import BackTop from '@/components/BackTop'
import { useNavigate } from 'react-router-dom'

export default function LeaderBoardPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const [total, setTotal] = useState('10.00M')
  const [holderList, setHolderList] = useState<any[]>([])
  const [rank, setRank] = useState(1)
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isShowRules, setShowRules] = useState(false)
  const [tab, setTab] = useState('Today')
  const navigate = useNavigate()
  const handleChangeTab = (type: string) => {
    setPage(1)
    setTab(type)
  }
  async function loadMore() {
    const append = await getList()
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setHolderList(append)
    } else {
      setHolderList(val => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  const getList = async () => {
    const res = await getUserGameListReq({ page, type: tab })
    setTotal(formatNumber(res.data.count))
    setPage((page => page + 1))
    setRank(res.data.rank)
    setCount(res.data.times)
    return res.data.rows
  }

  useEffect(() => {
    loadMore()
  }, [tab])

  return <div className="LeaderBoard fadeIn">
    <div className="title">
      𝓖𝓪𝓶𝓮 𝓦𝓪𝓵𝓵 𝓸𝓯 𝓕𝓪𝓶𝓮
      <svg onClick={() => setShowRules(true)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3544" width="26" height="26"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m-63.168-320.128V832h130.624v-128.128H448.832zM311.04 416.576h122.304c0-14.976 1.664-28.992 4.992-41.984a101.12 101.12 0 0 1 15.36-34.112c7.04-9.728 15.872-17.472 26.688-23.296 10.816-5.824 23.68-8.768 38.656-8.768 22.208 0 39.552 6.08 52.032 18.304 12.48 12.16 18.688 31.04 18.688 56.576 0.576 14.976-2.048 27.52-7.872 37.44-5.824 9.984-13.44 19.2-22.912 27.52-9.408 8.32-19.648 16.64-30.72 24.96-11.136 8.32-21.696 18.112-31.68 29.44a171.904 171.904 0 0 0-26.24 41.216c-7.424 16.064-12.032 36.032-13.696 59.904v37.44H568.96v-31.616c2.24-16.64 7.68-30.528 16.256-41.6 8.576-11.072 18.432-20.928 29.504-29.504 11.136-8.64 22.912-17.216 35.392-25.792a162.048 162.048 0 0 0 59.904-75.264c6.912-17.28 10.368-39.168 10.368-65.792a149.312 149.312 0 0 0-44.928-104c-16.064-16.064-37.248-29.504-63.616-40.32-26.368-10.88-59.2-16.256-98.56-16.256-30.528 0-58.112 5.12-82.816 15.36a183.68 183.68 0 0 0-63.232 42.88A195.392 195.392 0 0 0 326.4 334.208c-9.728 24.96-14.848 52.48-15.36 82.368z" fill="#1296db" p-id="3545"></path></svg>
    </div>
    {/* <div className='tabs'>
      <div className={`tab ${tab == 'Today' ? 'active-tab' : ''}`} onClick={() => handleChangeTab('Today')}>Today</div>
      <div className={`tab ${tab == 'Total' ? 'active-tab' : ''}`} onClick={() => handleChangeTab('Total')}>Total</div>
    </div> */}
    <div className="myself" onClick={() => navigate('/detail?myself=true&type=play_game_reward')}>
      <div className="left">
        <div className="icon" style={{ background: stringToColor(userInfo?.username) }}>
          {userInfo?.username?.slice(0, 2)}
        </div>
        <div className="name-score-warpper">
          <div className="name">{userInfo?.username}</div>
          <div className="name-score">Game:&nbsp;{userInfo?.game_score?.toLocaleString()}&nbsp;$HMSTR</div>
          <div className="name-score">Times:&nbsp;{count}&nbsp;</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src='/assets/common/NO1.png' alt="no1" /> : rank == 2 ? <img src='/assets/common/NO2.png' alt="no2" /> : rank == 3 ? <img src='/assets/common/NO3.png' alt="no3" /> : rank == 4 ? <img src='/assets/common/NO4.png' alt="no4" /> : rank == 5 ? <img src='/assets/common/NO5.png' alt="no5" /> : <span>#{rank}</span>
        }
      </div>
    </div>
    <div className="holders">
      <div className="holder-title">{total}&nbsp;players</div>
      <List>
        {
          holderList.map((item, index) => {
            return <List.Item key={index}>
              <ListItem {...{ ...item, rank: index + 1 }} />
            </List.Item>
          })
        }
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
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
          <div>Rewards</div>
          <svg onClick={() => setShowRules(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="18" height="18"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#000" p-id="5778"></path></svg>
        </div>
        <div className='popup-rule-wrapper'>
          <div className='popup-rule-content'>
            <div className='popup-rule-content-title'>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5414" width="16" height="16"><path d="M845.902988 0.000232H178.097244A177.864812 177.864812 0 0 0 0.000232 178.097244v667.805744a177.864812 177.864812 0 0 0 178.097012 178.097012h667.805744a177.864812 177.864812 0 0 0 178.097012-178.097012V178.097244A177.864812 177.864812 0 0 0 845.902988 0.000232zM512.000116 911.615445A75.929234 75.929234 0 1 1 587.929351 835.91841a77.090232 77.090232 0 0 1-75.929235 75.697035z m75.929235-340.172258v51.548287a75.929234 75.929234 0 0 1-151.858469 0v-114.938749a75.697035 75.697035 0 0 1 75.929234-75.929235A84.056217 84.056217 0 1 0 428.176099 348.299473a76.161434 76.161434 0 1 1-152.090669 0 235.914686 235.914686 0 1 1 311.843921 223.375913z" fill="#000" p-id="5415"></path></svg>
              How to Play
              <img src='/assets/logo.png' alt='logo' width={16} height={16} />
            </div>
            <ul>
              <li>Play game daily!</li>
              <li>Each game, we will add a portion of <img src='/assets/logo.png' alt='logo' width={16} height={16} /> to the prize pool.</li>
              <li>The top 3 winners will receive 50% of the prize pool</li>
              <li>The top 3-10 winners will receive 50% of the prize pool.</li>
              <li>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3174" data-spm-anchor-id="a313x.search_index.0.i5.2b3c3a81TUgFeH" width="16" height="16"><path d="M42.666667 896l938.666667 0-469.333333-810.666667-469.333333 810.666667zM554.666667 768l-85.333333 0 0-85.333333 85.333333 0 0 85.333333zM554.666667 597.333333l-85.333333 0 0-170.666667 85.333333 0 0 170.666667z" fill="#ecc115" p-id="3175" data-spm-anchor-id="a313x.search_index.0.i0.2b3c3a81TUgFeH" ></path></svg>
                &nbsp;Rewards will be distributed at 00:00 AM (UTC+0) every day!</li>
            </ul>
          </div>
        </div>
      </div>
    </Popup>
    <BackTop />
  </div>

  function ListItem({ username, game_score, rank }: { username: string, game_score: number, rank: number }) {
    return <div className="holders-item">
      <div className="holders-left">
        <div className="icon" style={{ background: stringToColor(username) }}>
          {
            username.slice(0, 2)
          }
        </div>
        <div className="name-score-wrapper">
          <div className="name">{username}</div>
          <div className="name-score">{game_score.toLocaleString()}&nbsp;$HMSTR</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src='/assets/common/NO1.png' alt="no1" /> : rank == 2 ? <img src='/assets/common/NO2.png' alt="no2" /> : rank == 3 ? <img src='/assets/common/NO3.png' alt="no3" /> : rank == 4 ? <img src='/assets/common/NO4.png' alt="no4" /> : rank == 5 ? <img src='/assets/common/NO5.png' alt="no5" /> : <span>#{rank}</span>
        }
      </div>

    </div>
  }
}