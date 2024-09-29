import { useEffect, useState } from 'react';
import './index.scss'
import { throttle } from '@/utils/common';

function BackTop({ scrollName }: { scrollName?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // 判断是否显示回到顶部按钮
  const toggleVisibility = () => {
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]
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
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]
    if (layoutElement) {
      layoutElement.addEventListener('scroll', throttle(toggleVisibility, 50))
    }
    return () => {
      layoutElement.removeEventListener('scroll', throttle(toggleVisibility, 50));
    };
  }, []);

  // 点击按钮回到顶部
  const scrollToTop = () => {
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]

    layoutElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return <div className='back-top' onClick={() => scrollToTop()} style={{ display: isVisible ? 'block' : 'none' }}>
    <img src="/assets/common/backTop.png" alt="backtop" />
  </div>
}

export default BackTop