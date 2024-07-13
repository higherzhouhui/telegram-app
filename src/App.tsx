import './App.scss';
import './trackers';
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import Begin from '@/components/Begin';
import Home from '@/components/Home';
import NewUser from '@/components/NewUser';
import EventBus from '@/utils/eventBus';
import WebApp from '@twa-dev/sdk'
import { loginReq } from '@/api/common';
import { useDispatch } from 'react-redux';
import { setUserInfoAction } from '@/redux/slices/userSlice'

function App() {
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance();
  const appRef: any = useRef(null);
  const size = useSize(appRef);
  const [appSize, setAppSize] = useState({ width: 0, height: 0 })
  const [step, setStep] = useState(1)
  const [newUserStep, setNewUserStep] = useState(0)

  const login = async () => {
    const initData = WebApp.initDataUnsafe
    let res: any;
    if (initData?.user?.id) {
      const user = WebApp.initDataUnsafe.user
      delete initData.user
      res = await loginReq({ ...initData, ...user })
    } else {
      res = await loginReq({
        query_id: 'AAE_Tv5XAgAAAD9O_lds0lWY',
        auth_date: '1720883932',
        hash: '21380e055a32d77fc2401bec59f7aab2db41eb645c36dc49ff18ed8e2324a2e5',
        id: 6954855144,
        first_name: 'leborn',
        last_name: 'james',
        username: 'cloudljj',
        language_code: 'zh-hans',
        allows_write_to_pm: true,
        start_param: btoa('5771251263')
      })
    }
    if (res.code == 0) {
      dispatch(setUserInfoAction(res.data))
      localStorage.setItem('authorization', res.data.user_id)
      try {
        WebApp.CloudStorage.setItem('authorization', res.data.user_id)
      } catch (error) {
        console.error(error)
      }
      if (res.data.is_New) {
        setStep(2)
      } else {
        setStep(0)
      }
    }
  }

  useEffect(() => {
    login()
  }, [])

  useEffect(() => {
    if (size && size.height && size.width) {
      setAppSize(size)
    }
  }, [size])

  useEffect(() => {
    const onMessage = (index: number) => {
      setStep(index)
      if (index == 2) {
        setNewUserStep(2)
      }
    }
    eventBus.addListener('updateStep', onMessage)
  }, [])
  return (
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          },
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"]
          },
          {
            appName: "binanceTonWeb3Wallet",
            name: "Binance Web3 Wallet",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
            aboutUrl: "https://www.binance.com/en/web3wallet",
            deepLink: "bnc://app.binance.com/cedefi/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "safari", "ios", "android"],
            universalLink: "https://app.binance.com/cedefi/ton-connect"
          },
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/tc_twa_demo_bot/start'
      }}
    >
      <div className="app" ref={appRef}>
        {
          step == 1 ? <Begin /> : step == 2 ? <NewUser cStep={newUserStep} /> : <Home />
        }
      </div>
    </TonConnectUIProvider>
  )
}

export default App
