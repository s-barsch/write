import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Texts, Text} from "./components/text"; 
import * as st from "./components/storage.js";
import newText from "./components/new";
import { makeNumber } from "./components/date";
import "./main.scss";
import Top from "./components/top";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.delQueue = this.delQueue.bind(this);
    this.delTexts = this.delTexts.bind(this);
    this.state = {
      newText: newText(),
      texts: [],
      queue: st.readQueue()
    };
  };

  async componentDidMount() {
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

  async save(t) {
    const texts = st.saveEntry(this.state.texts.slice(), t);
    this.setState({
      newText: newText(),
      texts: texts,
    });
    let queue = st.saveEntry(this.state.queue.slice(), t)
    st.writeQueue(queue);
    this.setState({
      queue: queue,
    });
    queue = await st.saveRemote(queue, t);
    this.setState({
      queue: queue,
    });
  }

  async saveNew(t) {
    this.setState({ newText: newText() });
    this.save(t);
  }

  async delTexts(t) {
    const texts = await st.deleteEntry(this.state.texts.slice(), t);
    this.setState({ texts: texts });
  }

  async delQueue(t) {
    const queue = st.deleteEntry(this.state.queue.slice(), t);
    st.writeQueue(queue);
    this.setState({ queue: queue });
  }

  render () {
    return (
      <Router>
      <Switch>
        <Route path="/" exact={true} render={() => (
          <div>
            <Top />
            <Text key={makeNumber(this.state.newText.id)} text={this.state.newText} saveFn={this.saveNew} />
            <Texts texts={this.state.texts} saveFn={this.save} delFn={this.delTexts} />
          </div>
        )} />
        <Route path="/texts/" exact={true} render={() => (
          <div>
            <Top />
            <Texts texts={this.state.texts} saveFn={this.save} delFn={this.delTexts} />
          </div>
        )} />
        <Route path="/texts/:file" exact={true} render={routeProps => (
          <div>
            <Top />
            File view
          </div>
        )} />
        <Route path="/queue/" exact={true} render={() => (
          <div>
            <Top />
            <Texts texts={this.state.queue} saveFn={this.save} delFn={this.delQueue} />
          </div>
        )} />
      </Switch>
      </Router>
    );
  }
}


export default App;
