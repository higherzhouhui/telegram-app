import { TonConnectButton } from "@tonconnect/ui-react";
import './header.scss';

export const Header = () => {
    return <header>
        <span>Games</span>
        <TonConnectButton style={{ minWidth: '120px' }} />
    </header>
}
