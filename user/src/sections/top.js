import { NavLink }  from "react-router-dom";
import React from "react";

const Top = ({ offlineStatus, offlineToggle }) => {
    return (
      <div>
      <nav id="nav">
        <NavLink to="/" exact={true}>Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        <input
          className="offline"
          name="isGoing"
          type="checkbox"
          onChange={offlineToggle}
          checked={offlineStatus}
           />
      { offlineStatus ? (
        <NavLink to="/queue/">Queue</NavLink>
      ) : (null)}
        {/*
        <NavLink to="/queue/">Queues</NavLink>
        <NavLink to="/deleted/">Deleted</NavLink>
        */}
      </nav>
      </div>
    );
}


export default Top
