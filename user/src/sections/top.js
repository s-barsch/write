import React, { useContext} from "react";
import { NavLink }  from "react-router-dom";
import { WriteContext } from "../controller/write";

const OfflineCheckbox = () => {
  const { offline, toggleOffline } = useContext(WriteContext);
  return (
    <input
      className="offline"
      type="checkbox"
      onChange={toggleOffline}
      checked={offline}
      />
  )
}

const DarkThemeCheckbox = () => {
  const { darkTheme, toggleDarkTheme } = useContext(WriteContext);
  return (
    <input
      className="offline"
      type="checkbox"
      onChange={toggleDarkTheme}
      checked={darkTheme}
      />
  )
}

const Top = () => {
  const { offline } = useContext(WriteContext);
  return (
    <nav id="nav">
      <NavLink to="/" exact={true}>Write</NavLink>
      <NavLink to="/texts/">Texts</NavLink>
      <OfflineCheckbox />
      { offline && <NavLink to="/queue/">Queue</NavLink> }
      <DarkThemeCheckbox />
    </nav>
  );
}


export default Top
