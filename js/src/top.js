import { Link }  from "react-router-dom";
import React from "react";

export default class Top extends React.Component {
    render() {
        return (
            <div>
            <h1><a className="nav" href="/">WRITE</a></h1>
            <nav className="top">
            <Link className="navl" to="/">Home</Link>
            <Link className="navl" to="/texts/">Texts</Link>
            <Link className="navl" to="/local/">Local</Link>
            </nav>
            </div>
        );
    }
}

