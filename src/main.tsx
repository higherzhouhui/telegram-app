import './patch-local-storage-for-github-pages';

import React, { StrictMode } from 'react'
import { render } from 'react-dom';
import App from './App'
import './index.scss'
// 开发调试需要用到
import eruda from "eruda";
import { Provider } from 'react-redux';
import store from './redux/store';
eruda.init();

render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.getElementById('root') as HTMLElement
)
