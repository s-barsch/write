import React from "react";
import { BrowserRouter as Router, Route, Switch, Link }  from "react-router-dom";

class App extends React.Component {
  render() {
    return (
        <Router>
        <Switch>
        <Route path="/texts/" render={() => (
            <div>
            <Nav />
                Texts.
            </div>
        )} />
        <Route exact={true} path="/" render={() => (
            <div>
            <Nav />
                Root page.
            </div>
        )} />
        </Switch>
        </Router>
    );
  }
}

function Nav() {
  return (
      <div>
      <Link to="/">Home</Link>
      <Link to="/texts/">Texts</Link>
      </div>
  );
}


export default App;
