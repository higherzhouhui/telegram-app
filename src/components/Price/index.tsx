import { useEffect, useState } from 'react';
import './index.scss'
import { getPriceReq } from '@/api/common';
import { initUtils } from '@telegram-apps/sdk';
import { Modal } from 'antd-mobile';

function PriceComp() {
  const [info, setInfo] = useState<any>({})
  const [rise, setRise] = useState(true)
  const utils = initUtils()
  const initPrice = async () => {
    const res: any = await getPriceReq(import.meta.env.DEV)
    if (res && res?.priceChangePercent) {
      if (res.priceChangePercent > 0) {
        setRise(true)
      } else {
        setRise(false)
      }
    }
    setInfo(res || {})
  }
  const handleOpenDogs = () => {
    Modal.confirm({
      title: 'Discover Dogs',
      content: 'Dogs is a TON chain meme token born in the Telegram community(2024-08)',
      cancelText: 'Cancel',
      confirmText: 'Look',
      closeOnMaskClick: true,
      onConfirm: () => {
        utils.openTelegramLink('https://t.me/dogs_community')
      }
    })
  }
  useEffect(() => {
    initPrice()
    setInterval(() => {
      initPrice()
    }, 10000);
  }, [])
  return <div className='price-comp' onClick={() => handleOpenDogs()}>
    <div className='left'>DOGS<span>/USDT</span></div>
    <div className='right'>
      <div className='price'>{info?.lastPrice}</div>
      <div className={`percent ${rise ? 'rise' : 'fall'}`}>{info?.priceChangePercent}%</div>
    </div>
  </div>
}

export default PriceComp;