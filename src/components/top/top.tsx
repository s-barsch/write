import React from 'react';
import { NavLink }  from 'react-router-dom';
import OnlineIcon from '@mui/icons-material/WifiSharp';
import ConnectingIcon from '@mui/icons-material/NetworkCheckSharp';
import OfflineIcon from '@mui/icons-material/WifiOffSharp';
import ThemeIcon from '@mui/icons-material/WbSunnySharp';
import { conStatesObj, SwitchFuncs } from 'helper';
import { reqStatus } from 'funcs/remote';
import { Status } from './status';

function ThemeToggle({switchTheme}: {switchTheme: () => void}) {
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
    conStates: conStatesObj;
}

function ConnectionToggle({switchConnection, conStates}: ConnectionToggleProps) {
    const Icon = ConnectionIcon(conStates.isConnecting, conStates.isOffline)

    return (
        <button onClick={switchConnection}><Icon /></button>
    )
}


type TopProps = {
    conStates: conStatesObj;
    switchFuncs: SwitchFuncs;
    status: reqStatus;
}

export default function Top({conStates, switchFuncs, status}: TopProps) {
    return (
        <nav id="nav">
        <NavLink to="/" end>Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        { /* conStates.isOffline && <NavLink to="/queue/">Local</NavLink> */ }
        <nav className="options">
        <Status status={status}>
            <ConnectionToggle switchConnection={switchFuncs.connection} conStates={conStates} />
        </Status>
        <ThemeToggle switchTheme={switchFuncs.theme} />
        </nav>
        </nav>
    );
}

