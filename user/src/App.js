import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.scss";
import Top from "./sections/top";
import Texts from "./sections/texts";
import Queue from "./sections/queue";
import NewText from "./sections/new";
import WriteProvider from "./controller/write";

const App = () => {
  return (
    <WriteProvider>
      <Router>

        <Top />
        <Switch>

          <Route exact={true} path="/">
            <NewText />
            <Texts />
          </Route>

          <Route path="/texts/">
            <Texts />
          </Route>

          <Route path="/queue/">
            <Queue />
          </Route>

        </Switch>

      </Router>
    </WriteProvider>
  );
}


export default App;
