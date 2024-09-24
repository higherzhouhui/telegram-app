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
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6577" width="32" height="32"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m185.61024 582.41024h-70.41024c-12.8 0-19.21024 6.38976-19.21024 19.18976v108.81024c0 6.38976-6.38976 12.77952-12.8 12.77952h-166.4c-6.38976 0-12.8-6.38976-12.8-12.77952v-115.22048c0-6.38976-6.38976-19.18976-19.18976-19.18976h-70.41024c-6.38976 6.41024-6.38976 0-6.38976 0l179.2-172.81024c6.41024-6.38976 12.8-6.38976 19.21024 0l185.58976 172.81024s0 6.41024-6.41024 6.41024z m6.38976-217.6h-384c-19.21024 0-32.01024-12.8-32.01024-32.01024s12.82048-32.01024 32.01024-32.01024h384c19.21024 0 32.01024 12.82048 32.01024 32.01024 0 19.21024-12.82048 32.01024-32.01024 32.01024z" fill="#8a8a8a" p-id="6578"></path></svg>
  </div>
}

export default BackTop