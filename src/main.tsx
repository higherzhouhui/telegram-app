import './patch-local-storage-for-github-pages';

import React, { StrictMode } from 'react'
import { render } from 'react-dom';
import App from './App'
import './index.scss'
// 开发调试需要用到
import eruda from "eruda";
eruda.init();

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root') as HTMLElement
)
