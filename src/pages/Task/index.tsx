import { useEffect, useState } from 'react'
import './index.scss'
import { taskListReq, handleTakReq } from '@/api/task'
import { initUtils } from '@telegram-apps/sdk'
import { Button, Skeleton, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

function TaskPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [handleLoading, setHandleLoading] = useState(false)
  const navigate = useNavigate()
  const handleDoTask = async (item: any, index: number) => {
    if (item.status != 'Done') {
      setHandleLoading(true)
      const res = await handleTakReq(item)
      if (res.code == 0) {
        const _list = JSON.parse(JSON.stringify(list))
        _list[index].status = res.data.status
        setList(_list)
      } else {
        Toast.show({ content: res.msg, position: 'top' })
        setHandleLoading(false)
      }
      if (item.status == null) {
        if (item.type.includes('telegram')) {
          const utils = initUtils()
          utils.openLink(item.link)
        } else if (item.type == 'twitter') {
          window.open(item.link)
        } else if (item.type == 'wallet') {
          navigate('/wallet')
        }
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
    <div className='task-title'>
      <img src='/assets/task-logo.png' alt='task' width={64} />
      <div className='task'>Tasks</div>
      <div className='desc'>Complete tasks to earn $TOMATO</div>
    </div>
    <div className='task-list'>
      {
        !loading ? [...Array(5)].map((_, index) => {
          return <Skeleton key={index} />
        }) : null
      }
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
              <Button className={`task-list-right-btn ${item.status}`} onClick={() => handleDoTask(item, index)} loading={handleLoading}>
                {
                  item.status || 'Start'
                }
              </Button>
            </div>
          </div>
        })
      }
    </div>
  </div>
}
export default TaskPage