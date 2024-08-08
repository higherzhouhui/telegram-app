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
      }, 2000);
    }
  }, [visible])
  return <>
    {
      isVisible ? <div className='penalty'>
        <img src="/assets/dec-penalty-1-2TQXhsXO.gif" alt="penalty" />
      </div> : null
    }
  </>
}