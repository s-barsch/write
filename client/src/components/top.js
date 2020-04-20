import { NavLink }  from "react-router-dom";
import React from "react";

const Top = ({ offlineStatus, offlineToggle }) => {
    return (
      <div>
      <nav id="nav">
        <NavLink exact={true} to="/">Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        <input
          className="offline"
          name="isGoing"
          type="checkbox"
          onChange={offlineToggle}
          checked={offlineStatus}
           />
      { offlineStatus ? (
        <NavLink to="/queues/">Queues</NavLink>
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
