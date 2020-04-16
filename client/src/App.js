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
    texts: st.readTexts(),
    writes: st.readWrites(),
    deletes: st.readDeletes(),
    offline: st.readOffline()
  };

  componentDidMount = async () => {
    if (!this.state.offline) {
      const response = await fetch("http://localhost:8231/api/texts/");
      const texts = await response.json();
      this.setState({ texts: texts });
    }
  };

  save = async t => {
    const texts = st.saveEntry(this.state.texts.slice(), t);
    st.saveTexts(texts);
    this.setState({
      newText: newText(),
      texts: texts,
    });

    let writes = st.saveEntry(this.state.writes.slice(), t)
    st.saveWrites(writes);
    this.setState({
      writes: writes,
    });

    if (!this.state.offline) {
      writes = await st.saveRemote(writes, t);
      this.setState({
        writes: writes,
      });
    }
  }

  saveNew = t => {
    this.setState({ newText: newText() });
    this.save(t);
  }

  delText = async t => {
    const texts = st.deleteEntry(this.state.texts.slice(), t);
    this.setState({ texts: texts });
    st.saveTexts(texts);

    if (st.hasEntry(this.state.writes, t)) {
      this.delWrite(t);
      return;
    }

    let deletes = st.saveEntry(this.state.deletes.slice(), t)
    st.saveDeletes(deletes);
    this.setState({
      deletes: deletes,
    });

    if (!this.state.offline) {
      deletes = await st.deleteRemote(deletes, t);
      this.setState({
        deletes: deletes,
      });
    }
  }

  delWrite = text => {
    const writes = st.deleteEntry(this.state.writes.slice(), text);
    st.saveWrites(writes);
    this.setState({ writes: writes });
  }

  delDelete = text => {
    const deletes = st.deleteEntry(this.state.deletes.slice(), text);
    st.saveDeletes(deletes);
    this.setState({ deletes: deletes });
  }

  toggleOffline = () => {
    if (this.state.offline) {
      this.setState({ offline: false });
      st.saveOffline("false");
      return
    }
    this.setState({ offline: true });
    st.saveOffline("true");
  }

  navComp = () => {
    return (
      <Top offlineStatus={this.state.offline} offlineToggle={this.toggleOffline} />
    )
  }

  newTextComp = () => {
    return (
      <Text key={makeNumber(this.state.newText.id)} text={this.state.newText} saveFn={this.saveNew} />
    )
  }

  textsComp = () => {
    return (
      <Texts texts={this.state.texts} saveFn={this.save} delFn={this.delText} />
    )
  }

  writesComp = () => {
    return (
      <Texts texts={this.state.writes} saveFn={this.save} delFn={this.delWrite} />
    )
  }

  deletesComp = () => {
    return (
      <Texts texts={this.state.deletes} saveFn={this.save} delFn={this.delDelete} />
    )
  }


  render () {
    return (
      <Router>
      <Switch>
        <Route path="/" exact={true} render={() => (
          <div>
            {this.navComp()}
            {this.newTextComp()}
            {this.textsComp()}
          </div>
        )} />
        <Route path="/texts/" exact={true} render={() => (
          <div>
            {this.navComp()}
            {this.textsComp()}
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
            {this.navComp()}
            <div>
              {this.state.deletes.length > 0 ? (<h2>deletes</h2>) : (null) }
              {this.deletesComp()}
            </div>
            <div>
              {this.state.deletes.length > 0 ? (<h2>writes</h2>) : (null) }
              {this.writesComp()}
            </div>
          </div>
        )} />
      </Switch>
      </Router>
    );
  }
}


export default App;
