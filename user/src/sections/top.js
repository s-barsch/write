import React, { useContext} from "react";
import { NavLink }  from "react-router-dom";
import { WriteContext } from "../controller/write";

const OfflineCheckbox = () => {
  const { offline, toggleOffline } = useContext(WriteContext);
  return (
    <input
      className="offline"
      name="isGoing"
      type="checkbox"
      onChange={toggleOffline}
      checked={offline}
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
    { <NavLink to="/queue/">Queue</NavLink> && offline }
    </nav>
  );
}


export default Top
