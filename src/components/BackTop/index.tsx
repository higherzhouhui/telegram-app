import { useEffect, useState } from 'react';
import './index.scss'
import { throttle } from '@/utils/common';

function BackTop({ scrollName }: { scrollName: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // 判断是否显示回到顶部按钮
  const toggleVisibility = () => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]
    if (layoutElement) {
      if (layoutElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false)
    }
  };

  // 滚动事件监听器
  useEffect(() => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]
    if (layoutElement) {
      layoutElement.addEventListener('scroll', throttle(toggleVisibility, 50))
    }
    return () => {
      layoutElement.removeEventListener('scroll', throttle(toggleVisibility, 50));
    };
  }, []);

  // 点击按钮回到顶部
  const scrollToTop = () => {
    const layoutElement = document.getElementsByClassName(scrollName)[0]

    layoutElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return <div className='back-top' onClick={() => scrollToTop()} style={{ display: isVisible ? 'block' : 'none' }}>
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5855" width="32" height="32"><path d="M38.04 518.35a475.12 487.33 0 1 0 950.24 0 475.12 487.33 0 1 0-950.24 0Z" fill="#07AA74" p-id="5856"></path><path d="M513.16 18.75C258.74 18.75 52.5 224.99 52.5 479.41s206.25 460.66 460.66 460.66 460.66-206.25 460.66-460.66S767.58 18.75 513.16 18.75z m0 769.72c-170.69 0-309.06-138.37-309.06-309.06s138.37-309.06 309.06-309.06 309.06 138.37 309.06 309.06-138.37 309.06-309.06 309.06z" fill="#56D8B0" p-id="5857"></path><path d="M649.56 473.65L543.69 290.31c-13.57-23.51-47.49-23.51-61.07 0L376.77 473.65c-13.58 23.51 3.39 52.89 30.53 52.89h59.46v113.2c0 25.63 20.77 46.4 46.4 46.4 25.62 0 46.4-20.77 46.4-46.4v-113.2h59.46c27.14 0.01 44.11-29.38 30.54-52.89z" fill="#FFBE1D" p-id="5858"></path></svg>  </div>
}

export default BackTop