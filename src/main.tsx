// import './patch-local-storage-for-github-pages';

// import { StrictMode } from 'react'
// import { render } from 'react-dom';
// import App from './App'
// import './index.scss'
// // 开发调试需要用到
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import { ConfigProvider } from 'antd-mobile';
// import enUS from 'antd-mobile/es/locales/en-US'
// import eruda from "eruda";

// eruda.init();

// render(
//     <StrictMode>
//         <ConfigProvider locale={enUS}>
//             <Provider store={store}>
//                 <App />
//             </Provider>
//         </ConfigProvider>
//     </StrictMode>,
//     document.getElementById('root') as HTMLElement
// )

import ReactDOM from 'react-dom/client';

import { Root } from '@/components/Root';

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
import './mockEnv';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.scss';

import eruda from "eruda";

eruda.init();

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

