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
    const images = ['/assets/hmstr1.png', '/assets/dogs.png', '/assets/ton.png'];
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
    }, 5000);
  }, [])
  useEffect(() => {
    initPrice()
  }, [index])
  return <div className='price-comp' onClick={() => handleOpenDogs()}>
    <div className='left'>
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14564" width="20" height="20"><path d="M775.779 418.172l-2.051 0c-15.159 0-27.6 4.355-39.583 11.771-10.486-30.584-37.159-52.615-71.513-52.615-15.16 0-29.638 4.354-41.62 11.77-10.487-30.583-37.172-52.615-71.527-52.615-13.399 0-25.85 3.357-36.873 9.255l0-78.691c0-42.861-32.418-77.606-75.59-77.606-43.173 0-78.17 34.745-78.17 77.606l0 301.282-47.49-47.295c-30.528-30.306-84.558-25.992-110.55 0s-43.038 78.308-5.818 115.528l218.306 216.875c4.504 4.471 9.455 8.2 14.663 11.353 39.803 32.47 85.412 51.692 181.857 51.692 220.324 0 240.728-118.865 240.728-265.492L850.548 495.777C850.547 452.917 818.952 418.172 775.779 418.172zM809.403 650.988c0 124.069-0.593 224.647-199.585 224.647-84.298 0-134.907-18.796-173.246-56.858L229.904 613.455c-18.285-18.285-13.687-41.664 1.282-56.633 14.968-14.968 42.441-15.486 56.902-1.131 0 0 36.259 36.045 67.498 67.1 23.641 23.502 44.408 44.145 44.408 44.145l0-391.72c0-20.302 16.578-36.76 37.028-36.76 20.449 0 34.448 16.459 34.448 36.76l0 249.154 0.415 0c-0.27 1.32-0.415 2.685-0.415 4.085 0 11.278 9.21 20.423 20.571 20.423 11.36 0 20.57-9.144 20.57-20.423 0-1.4-0.144-2.765-0.415-4.085l0.415 0L512.611 422.257c0-20.302 14.795-36.761 35.245-36.761 0 0 36.232-0.49 36.232 36.761l0 134.787 0.415 0c-0.27 1.321-0.415 2.686-0.415 4.085 0 11.279 9.21 20.423 20.57 20.423 11.361 0 20.571-9.143 20.571-20.423 0-1.399-0.144-2.764-0.415-4.085l0.415 0 0-93.942c0-20.303 14.559-36.762 35.01-36.762 0 0 36.983 2.303 36.983 36.762l0 118.449 0.415 0c-0.269 1.32-0.415 2.686-0.415 4.085 0 11.279 9.21 20.423 20.571 20.423s20.055-9.143 20.055-20.423c0-1.399-0.136-2.765-0.392-4.085l0.392 0 0-80.872c0-20.302 15.255-36.761 35.704-36.761 0 0 35.851-1.45 35.851 36.761C809.403 500.679 809.403 617.954 809.403 650.988zM328.307 382.755l0-68.631c-6.531-14.641-10.24-30.817-10.24-47.884 0-65.037 52.723-117.76 117.76-117.76s117.76 52.723 117.76 117.76c0 8.884-1.05 17.509-2.935 25.82 14.812 0.578 28.176 6.726 37.904 16.597 3.771-13.518 5.99-27.685 5.99-42.417 0-87.658-71.062-158.72-158.72-158.72s-158.72 71.062-158.72 158.72C277.107 312.36 296.898 353.755 328.307 382.755z" p-id="14565" fill="#ffffff"></path></svg>
      {info?.symbol?.replace('USDT', '')}<span>/USDT</span></div>
    <div className='right'>
      <div className='price'>{info?.lastPrice}</div>
      <div className={`percent ${rise ? 'rise' : 'fall'}`}>{info?.priceChangePercent}%</div>
    </div>
  </div>
}

export default PriceComp;