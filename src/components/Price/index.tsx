import { useEffect, useRef, useState } from 'react';
import './index.scss'
import { getPriceReq } from '@/api/common';
import { initUtils } from '@telegram-apps/sdk';
import { Modal } from 'antd-mobile';
import { useDispatch } from 'react-redux';
import { setHMAction } from '@/redux/slices/userSlice';

function PriceComp() {
  const dispatch = useDispatch()
  const [info, setInfo] = useState<any>({})
  const [rise, setRise] = useState(true)
  const [intro, setIntro] = useState('')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [index, setIndex] = useState(0)
  const [image, setImage] = useState('')
  const utils = initUtils()
  const initPrice = async () => {
    const _index = index % 3
    const types = ['HMSTRUSDT', 'DOGSUSDT', 'TONUSDT']
    const strings = ['Hamster is a cryptocurrency exchange CEO simulator game built on the Telegram mini program platform', 'DOGS is a Ton chain meme token born in the Telegram community', 'Toncoin is a decentralized, developed L1 blockchain created by the community using technology designed by Telegram']
    const title = ['HMSTR', 'DOGS', 'TON'];
    const images = ['/assets/hmstr.png', '/assets/dogs.png', '/assets/ton.png'];
    const links = ['https://t.me/hamster_kombat', 'https://t.me/dogs_community', 'https://t.me/toncoin'];
    setIntro(strings[_index])
    setTitle(title[_index])
    setLink(links[_index])
    setImage(images[_index])
    const res: any = await getPriceReq(import.meta.env.DEV, types[_index])

    if (res && res?.priceChangePercent) {
      if (res.priceChangePercent > 0) {
        setRise(true)
      } else {
        setRise(false)
      }
    }
    if (_index == 0) {
      dispatch(setHMAction({ price: res?.lastPrice }))
    }
    setInfo(res || {})
  }
  const handleOpenDogs = () => {
    Modal.confirm({
      title: title,
      content: intro,
      cancelText: '',
      confirmText: 'Discover',
      closeOnMaskClick: true,
      image: image,
      onConfirm: () => {
        utils.openTelegramLink(link)
      }
    })
  }
  useEffect(() => {
    setInterval(() => {
      setIndex(p => p + 1)
    }, 10000);
  }, [])
  useEffect(() => {
    initPrice()
  }, [index])
  return <div className='price-comp' onClick={() => handleOpenDogs()}>
    <div className='left'>{info?.symbol?.replace('USDT', '')}<span>/USDT</span></div>
    <div className='right'>
      <div className='price'>{info?.lastPrice}</div>
      <div className={`percent ${rise ? 'rise' : 'fall'}`}>{info?.priceChangePercent}%</div>
    </div>
  </div>
}

export default PriceComp;