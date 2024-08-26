import { useNavigate } from 'react-router-dom'
import './index.scss'
import LOGO from '@/assets/logo.jpg'
import { useEffect } from 'react'
export default function () {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigate('/second')
    }, 1500);
  }, [])
  return <div className='begin-wrapper'>
    {/* <img src={LOGO} alt="logo" /> */}
    <span>Who are you dawg?</span>
  </div>
}