import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Texts, Text} from "./components/text"; 
import * as st from "./components/storage.js";
import newText from "./components/new";
import { makeNumber } from "./components/date";
import "./main.scss";
import Top from "./components/top";

class App extends React.Component {
  state = {
    newText: newText(),
    texts: [],
    writes: st.readWrites(),
    deletes: st.readDeletes()
  };

  componentDidMount = async () => {
    if (this.state.texts.length !== 0) {
      console.log("no fetch");
      return
    }
    const response = await fetch("http://localhost:8231/api/texts/");
    const texts = await response.json();
    console.log(texts);
    this.setState({ texts: texts });
    console.log(this.state);
  };

  save = async t => {
    const texts = st.saveEntry(this.state.texts.slice(), t);
    this.setState({
      newText: newText(),
      texts: texts,
    });

    let writes = st.saveEntry(this.state.writes.slice(), t)
    st.saveWrites(writes);
    this.setState({
      writes: writes,
    });

    writes = await st.saveRemote(writes, t);
    this.setState({
      writes: writes,
    });
  }

  saveNew = t => {
    this.setState({ newText: newText() });
    this.save(t);
  }

  delText = async t => {
    const texts = st.deleteEntry(this.state.texts.slice(), t);
    this.setState({ texts: texts });

    if (st.hasEntry(this.state.writes, t)) {
      this.delWrite(t);
      return;
    }

    let deletes = st.saveEntry(this.state.deletes.slice(), t)
    st.saveDeletes(deletes);
    this.setState({
      deletes: deletes,
    });

    deletes = await st.deleteRemote(deletes, t);
    this.setState({
      deletes: deletes,
    });
  }

  delWrite = text => {
    const writes = st.deleteEntry(this.state.writes.slice(), text);
    st.saveWrites(writes);
    this.setState({ writes: writes });
  }

  delDelete= text => {
    const deletes = st.deleteEntry(this.state.deletes.slice(), text);
    st.saveDeletes(deletes);
    this.setState({ deletes: deletes });
  }

  render () {
    return (
      <Router>
      <Switch>
        <Route path="/" exact={true} render={() => (
          <div>
            <Top />
            <Text key={makeNumber(this.state.newText.id)} text={this.state.newText} saveFn={this.saveNew} />
            <Texts texts={this.state.texts} saveFn={this.save} delFn={this.delText} />
          </div>
        )} />
        <Route path="/texts/" exact={true} render={() => (
          <div>
            <Top />
            <Texts texts={this.state.texts} saveFn={this.save} delFn={this.delText} />
          </div>
        )} />
        <Route path="/texts/:file" exact={true} render={routeProps => (
          <div>
            <Top />
            File view
          </div>
        )} />
        <Route path="/queues/" exact={true} render={() => (
          <div>
            <Top />
            <div>
              {this.state.delet > 0 ? (<h2>Delete</h2>) : (null) }
              <Texts texts={this.state.deletes} saveFn={this.save} delFn={this.delDelete} />
            </div>
            <div>
              {this.state.delet > 0 ? (<h2>Write</h2>) : (null) }
              <Texts texts={this.state.writes} saveFn={this.save} delFn={this.delWrite} />
            </div>
          </div>
        )} />
      </Switch>
      </Router>
    );
  }
}


export default App;
