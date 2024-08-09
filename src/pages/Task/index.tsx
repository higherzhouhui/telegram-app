import { useEffect, useState } from 'react'
import './index.scss'
import { taskListReq, handleTakReq } from '@/api/task'
import Loading from '@/components/Loading'
import { initUtils } from '@telegram-apps/sdk'
import { Button } from 'antd-mobile'

export default function () {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [handleLoading, setHandleLoading] = useState(false)
  const handleDoTask = async (item: any, index: number) => {
    if (item.status != 'done') {
      setHandleLoading(true)
      const res = await handleTakReq(item)
      const _list = JSON.parse(JSON.stringify(list))
      _list[index] = res.data
      setList(_list)
      if (item.status == null) {
        const utils = initUtils()
        utils.openLink(item.link)
      }
    }
  }
  useEffect(() => {
    if (handleLoading) {
      setTimeout(() => {
        setHandleLoading(false)
      }, 3000);
    }
  }, [handleLoading])
  useEffect(() => {
    setLoading(true)
    taskListReq().then(res => {
      setLoading(false)
      setList(res.data)
    })
  }, [])
  return <div className='task-page fadeIn'>
    {
      loading ? <Loading /> : null
    }
    <div className='task-title'>
      <img src='/assets/task-logo.png' alt='task' width={64} />
      <div className='task'>Tasks</div>
      <div className='desc'>Complete tasks to earn $TOMATO</div>
    </div>
    <div className='task-list'>
      {
        list.map((item: any, index) => {
          return <div key={index} className='task-list-item'>
            <div className='task-list-left'>
              <img src={`/assets/${item.type}.png`} alt={item.type} className='type-img' />
              <div className='middle'>
                <div className='middle-name'>{item.name}</div>
                <div className='reward'>
                  <span>+{item.score.toLocaleString()}</span>
                  &nbsp;<img src='/assets/tomato-32x32.webp' alt='tomato' className='unit-img' />
                  &nbsp;$TOMATO
                </div>
              </div>
            </div>
            <div className='task-list-right'>
              <Button className={`task-list-right-btn ${item.status == 'claim' ? 'claim' : item.status == 'done' ? 'done' : ''}`} onClick={() => handleDoTask(item, index)} loading={handleLoading}>
                {
                  item.status == null ? 'Start' : item.status == 'claim' ? 'Claim' : 'Done'
                }
              </Button>
            </div>
          </div>
        })
      }
    </div>
  </div>
}