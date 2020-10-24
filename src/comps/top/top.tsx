import React from "react";
import { NavLink }  from "react-router-dom";
import OnlineIcon from '@material-ui/icons/WifiSharp';
import ConnectingIcon from '@material-ui/icons/NetworkCheckSharp';
import OfflineIcon from '@material-ui/icons/WifiOffSharp';
import ThemeIcon from '@material-ui/icons/WbSunnySharp';
import { ConStates, SwitchFuncs } from 'helper';

function ConnectionIcon(connecting: boolean, offline: boolean) {
    if (connecting) {
        return ConnectingIcon;
    } else if (offline) {
        return OfflineIcon;
    } 
    return OnlineIcon;
}

type TopProps = {
    conStates: ConStates;
    switchFuncs: SwitchFuncs;
}

function ConnectionToggle({conStates, switchFuncs}: TopProps) {
    const Icon = ConnectionIcon(conStates.connecting, conStates.offline)

    return (
        <button onClick={switchFuncs.connection}><Icon /></button>
    )
}

function ThemeToggle({switchTheme}: {switchTheme: () => void}) {
    return (
        <button onClick={switchTheme}><ThemeIcon /></button>
    )
}

function Top({conStates, switchFuncs}: TopProps) {
    return (
        <nav id="nav">
        <NavLink to="/" exact={true}>Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        { /* conStates.offline && <NavLink to="/queue/">Local</NavLink> */ }
        <nav className="options">
        <ConnectionToggle conStates={conStates} switchFuncs={switchFuncs} />
        <ThemeToggle switchTheme={switchFuncs.theme} />
        </nav>
        </nav>
    );
}


export default Top
