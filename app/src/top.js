import React from "react";
import { NavLink }  from "react-router-dom";
import OnlineIcon from '@material-ui/icons/WifiSharp';
import ConnectingIcon from '@material-ui/icons/NetworkCheckSharp';
import OfflineIcon from '@material-ui/icons/WifiOffSharp';
import ThemeIcon from '@material-ui/icons/WbSunnySharp';

const ConnectionIcon = (connecting, offline) => {
  if (connecting) {
    return ConnectingIcon;
  } else if (offline) {
    return OfflineIcon;
  } 
  return OnlineIcon;
}

const ConnectionToggle = ({conStates, switchFuncs}) => {
  const Icon = ConnectionIcon(conStates.connecting, conStates.offline)

  return (
    <button onClick={switchFuncs.connection}><Icon /></button>
  )
}

const ThemeToggle = ({switchTheme}) => {
  return (
    <button onClick={switchTheme}><ThemeIcon /></button>
  )
}

const Top = ({conStates, switchFuncs}) => {
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
