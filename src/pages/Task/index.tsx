import { useEffect, useState } from 'react'
import './index.scss'
import { taskListReq, handleTakReq } from '@/api/task'
import { initUtils } from '@telegram-apps/sdk'
import { Button, Skeleton, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import BackTop from '@/components/BackTop'
import { useLaunchParams } from '@telegram-apps/sdk-react'

function TaskPage() {
  const launchParams = useLaunchParams();
  const utils = initUtils();
  const [list, setList] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const handleDoTask = async (item: any, index: number, cIndex: number) => {
    if (item.status != 'Done') {
      const _list = JSON.parse(JSON.stringify(list))
      _list[index][cIndex].loading = true
      setList(_list)
      const res = await handleTakReq(item)
      if (res.code == 0) {
        const _list = JSON.parse(JSON.stringify(list))
        _list[index][cIndex].status = res.data.status
        _list[index][cIndex].loading = false
        setTimeout(() => {
          setList(_list)
        }, 10000);
      } else {
        Toast.show({ content: res.msg, position: 'top' })
        const _list = JSON.parse(JSON.stringify(list))
        _list[index][cIndex].loading = false
        setList(_list)
      }
      if (item.status == null) {
        if (localStorage.getItem('h5PcRoot') == '1' || launchParams.platform == 'tdesktop') {
          if (item.linkType == 'self') {
            navigate(item.link)
          } else {
            window.open(item.link)
            // if (!open) {
            //   location.href = item.link
            // }
          }
        } else {
          if (item.linkType.includes('telegram')) {
            utils.openLink(item.link)
          } else if (item.linkType == 'outside') {
            location.href = item.link
          } else if (item.linkType == 'self') {
            navigate(item.link)
          }
        }
      }
    }
  }

  const groupByType = (arr: any) => {
    return Object.values(
      arr.reduce((acc: any, item: any) => {
        const type = item.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      }, {})
    );
  }

  const getImgSrc = (img: string) => {
    if (img.includes('Game')) {
      return 'game'
    }
    if (img.includes('Portkey') || img.includes('Protkey')) {
      return 'portkey'
    }
    if (img.includes('Aelf')) {
      return 'aelf'
    }
    return 'game'
  }


  useEffect(() => {
    setLoading(true)
    taskListReq().then(res => {
      setLoading(false)
      if (res.code == 0) {
        res.data.map((item: any) => {
          item.loading = false
        })
        const list = groupByType(res.data)
        setList(list)
      }
    })
  }, [])
  return <div className='task-page fadeIn'>
    <div className='task-title'>
      <img src='/assets/tasks.gif' alt='task' width={150} />
      <div className='task'>Tasks</div>
      <div className='desc'>Complete tasks to earn COIN</div>
    </div>
    <div className='task-list'>
      {
        loading ? [...Array(5)].map((_, index) => {
          return <Skeleton className='skeleton' animated key={index} />
        }) : <div></div>
      }
      {
        list.map((item: any, index: number) => {
          return <div className='item-wrapper' key={index}>
            <div className='item-wrapper-title'>
              <img src={`/assets/task/${getImgSrc(item[0].type)}.png`} className='logo-pic' alt="penalty" />
              {
                item[0].type
              }
              <img src='/assets/task/touch.png' className='touch' alt="penalty" />
            </div>
            {
              item.map((citem: any, cindex: number) => {
                return <div key={cindex} className='task-list-item'>
                  <div className='task-list-left'>
                    <div className='middle'>
                      <div className='middle-name'>{citem.name}</div>
                      <div className='reward'>
                        <span>+{citem?.score?.toLocaleString()}</span>
                        &nbsp;<img src='/assets/common/cat.webp' alt='tomato' className='unit-img' />
                        &nbsp;COIN
                      </div>
                    </div>
                  </div>
                  <div className='task-list-right'>
                    <Button className={`task-list-right-btn ${citem.status}`} onClick={() => handleDoTask(citem, index, cindex)} loading={citem.loading}>
                      {
                        citem.status || 'Start'
                      }
                    </Button>
                  </div>
                </div>
              })
            }
          </div>
        })
      }
    </div>
    <BackTop scrollName='content' />
  </div>
}
export default TaskPage