import './patch-local-storage-for-github-pages';

import { StrictMode } from 'react'
import { render } from 'react-dom';
import App from './App'
import './index.scss'
// 开发调试需要用到
import eruda from "eruda";
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US'

eruda.init();

render(
    <StrictMode>
        <ConfigProvider locale={enUS}>
            <Provider store={store}>
                <App />
            </Provider>
        </ConfigProvider>
    </StrictMode>,
    document.getElementById('root') as HTMLElement
)
