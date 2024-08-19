import { useCallback, useEffect, useMemo } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { PortkeyDid } from '@aelf-web-login/wallet-adapter-bridge';
import { ExtraInfoForPortkeyAA } from './type';
import { useNavigate } from 'react-router-dom';

export default function MyAsset() {
  const navigate = useNavigate()
  const { walletType, walletInfo } = useConnectWallet();
  const portkeyAAInfo = useMemo(() => {
    return walletInfo?.extraInfo as ExtraInfoForPortkeyAA;
  }, [walletInfo?.extraInfo]);

  const handleDeleteAccount = useCallback(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    console.log(walletType)
    console.log(walletInfo)
    if (walletType !== WalletTypeEnum.aa) {
      navigate('/')
    }
  }, [walletType, navigate]);

  if (
    walletType !== WalletTypeEnum.aa ||
    !portkeyAAInfo?.portkeyInfo?.pin ||
    !portkeyAAInfo?.portkeyInfo?.chainId
  ) {
    return null;
  }

  return (
    <div className={styles['my-asset-wrapper']}>
      <PortkeyDid.PortkeyAssetProvider
        originChainId={portkeyAAInfo?.portkeyInfo?.chainId}
        pin={portkeyAAInfo?.portkeyInfo?.pin}>
        <PortkeyDid.Asset
          isShowRamp={false}
          isShowRampBuy={false}
          isShowRampSell={false}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => navigate(-1)}
          onLifeCycleChange={(lifeCycle) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
          onDeleteAccount={handleDeleteAccount}
        />
      </PortkeyDid.PortkeyAssetProvider>
    </div>
  );
}
