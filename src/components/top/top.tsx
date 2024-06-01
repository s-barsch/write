import React from 'react';
import { NavLink }  from 'react-router-dom';
import OnlineIcon from '@mui/icons-material/WifiSharp';
import ConnectingIcon from '@mui/icons-material/NetworkCheckSharp';
import OfflineIcon from '@mui/icons-material/WifiOffSharp';
import ThemeIcon from '@mui/icons-material/WbSunnySharp';
import { SwitchFuncs } from 'helper';
import { reqStatus } from 'funcs/remote';
import { Status } from './status';
import useThemeStore from 'stores/theme';
import useConnectionStore from 'stores/connection';

function ThemeToggle() {
    const { switchTheme } = useThemeStore();
    return (
        <button onClick={switchTheme}><ThemeIcon /></button>
    )
}


function ConnectionIcon(isConnecting: boolean, isOffline: boolean) {
    if (isConnecting) {
        return ConnectingIcon;
    } else if (isOffline) {
        return OfflineIcon;
    } 
    return OnlineIcon;
}

type ConnectionToggleProps = {
    switchConnection: () => void;
}

function ConnectionToggle({switchConnection}: ConnectionToggleProps) {
    const { isOffline, isConnecting } = useConnectionStore()
    const Icon = ConnectionIcon(isConnecting, isOffline)

    return (
        <button onClick={switchConnection}><Icon /></button>
    )
}


type TopProps = {
    switchFuncs: SwitchFuncs;
    status: reqStatus;
}

export default function Top({switchFuncs, status}: TopProps) {
    return (
        <nav id="nav">
        <NavLink to="/" end>Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        { /* conStates.isOffline && <NavLink to="/queue/">Local</NavLink> */ }
        <nav className="options">
        <Status status={status}>
            <ConnectionToggle switchConnection={switchFuncs.connection} />
        </Status>
        <ThemeToggle />
        </nav>
        </nav>
    );
}

