import { useEffect, useState } from 'react'
import './index.scss'

export default function ({ visible, callBack }: { visible: boolean, callBack: () => void }) {
  const [isVisible, setIsVisible] = useState(visible)
  useEffect(() => {
    setIsVisible(visible)
    if (visible) {
      setTimeout(() => {
        setIsVisible(false)
        callBack()
      }, 3000);
    }
  }, [visible])
  return <>
    {
      isVisible ? <div className='penalty'>
        <img src="/assets/common/boom.gif" alt="penalty" />
      </div> : null
    }
  </>
}