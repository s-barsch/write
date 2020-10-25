import React from "react";
import { NavLink }  from "react-router-dom";
import OnlineIcon from '@material-ui/icons/WifiSharp';
import ConnectingIcon from '@material-ui/icons/NetworkCheckSharp';
import OfflineIcon from '@material-ui/icons/WifiOffSharp';
import ThemeIcon from '@material-ui/icons/WbSunnySharp';
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
        <NavLink to="/" exact={true}>Write</NavLink>
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

