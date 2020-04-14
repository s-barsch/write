import { NavLink }  from "react-router-dom";
import React from "react";

export default class Top extends React.Component {
    render() {
        return (
          <div>
            <nav id="nav">
              <NavLink exact={true} to="/">Write</NavLink>
              <NavLink to="/texts/">Texts</NavLink>
              <NavLink to="/local/">Local</NavLink>
            </nav>
          </div>
        );
    }
}

