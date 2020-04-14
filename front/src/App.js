import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Texts, Text} from "./components/text"; 
import { appendLocal, deleteLocal, saveLocal, getLocals } from "./components/storage.js";
import newText from "./components/new";
import { makeNumber } from "./components/date";
import "./main.scss";
import Top from "./components/top";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.del = this.del.bind(this);
    this.state = {
      newText: newText(),
      texts: [],
      locals: getLocals()
    };
  };

  async save(t) {
    const locals = await saveLocal(this.state.locals.slice(), t);
    this.setState({ locals: locals });
  }
  async saveNew(t) {
    const locals = await appendLocal(this.state.locals.slice(), t);
    this.setState({
      newText: newText(),
      locals: locals
    });
  }
  async del(t) {
    const locals = await deleteLocal(this.state.locals.slice(), t);
    this.setState({ locals: locals });
  }

  render () {
    return (
      <Router>
      <Switch>
        <Route path="/texts/" exact={true} render={() => (
          <div>
            <Top />
          </div>
        )} />
        <Route path="/local/" exact={true} render={() => (
          <div>
            <Top />
          </div>
        )} />
        <Route path="/" exact={true} render={() => (
          <div>
            <Top />
            <Text key={makeNumber(this.state.newText.id)} text={this.state.newText} saveFn={this.saveNew} />
            <Texts texts={this.state.locals} saveFn={this.save} delFn={this.del} />
          </div>
        )} />
      </Switch>
      </Router>
    );
  }
}

export default App;
