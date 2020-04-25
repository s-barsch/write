import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.css";
import Top from "./sections/top";
import Texts from "./sections/texts";
import Single from "./sections/single";
import Queue from "./sections/queue";
import NewText from "./sections/new";
import WriteProvider from "./controller/write";

const App = () => {
  return (
    <Router>
    <WriteProvider>

        <Top />
        <Switch>
          <Route exact={true} path="/">
            <NewText />
            {/*
            <Texts />
            */}
          </Route>

          <Route path="/texts/:name">
            <Single />
          </Route>

          <Route path="/texts/">
            <Texts />
          </Route>

          <Route path="/queue/">
            <Queue />
          </Route>
        </Switch>

    </WriteProvider>
    </Router>
  );
}


export default App;
