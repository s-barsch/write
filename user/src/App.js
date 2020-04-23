import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.scss";
import Top from "./components/top";
import Texts from "./sections/texts";
import WriteProvider from "./context/texts";

const App = () => {
  return (
    <WriteProvider>
      <Router>

        <Top />
        <Switch>

          <Route exact={true} path="/">
            Root
          </Route>

          <Route path="/texts/">
            <Texts />
          </Route>

          <Route path="/queue/">
            {/*<Queue />*/}
          </Route>

        </Switch>

      </Router>
    </WriteProvider>
  );
}


export default App;
