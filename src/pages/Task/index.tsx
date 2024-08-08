import { useEffect } from 'react'
import './index.scss'
import { taskListReq } from '@/api/task'

export default function () {
  useEffect(() => {
    taskListReq()
  }, [])
  return <div className='task-page'>
    <div className='task-title'>

    </div>
  </div>
}