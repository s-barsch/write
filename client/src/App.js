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
    if (!this.state.offline && this.queuesEmpty()) {
      const response = await fetch("/api/texts/");
      const texts = await response.json();
      this.setTexts(texts);
    }
  };

  queuesEmpty = () => {
    if (this.state.writes.length === 0 && this.state.deletes.length === 0) {
      return true
    }
    return false
  }

  emptyQueues = async () => {
    let writes = this.state.writes.slice();
    for (const text of writes) {
      writes = await st.saveRemote(writes, text);
      this.setWrites(writes);
    }

    let deletes = this.state.deletes.slice();
    for (const text of deletes) {
      deletes = await st.deleteRemote(deletes, text);
      this.setDeletes(deletes);
    }
  }

  save = async t => {
    this.putTexts(t)

    let writes = this.putWrites(t);

    if (!this.state.offline) {
      writes = await st.saveRemote(writes, t);
      this.setWrites(writes);
    }
  }

  putTexts = text => {
    const texts = st.putEntry(this.state.texts.slice(), text);
    this.setTexts(texts);
    return texts
  }

  putDeletes = text => {
    const deletes = st.putEntry(this.state.deletes.slice(), text)
    this.setDeletes(deletes);
    return deletes
  }

  putWrites = text => {
    const writes = st.putEntry(this.state.writes.slice(), text)
    this.setWrites(writes);
    return writes
  }

  setTexts = texts => {
    this.setState({ texts: texts, });
    st.saveTexts(texts);
  }

  setWrites = writes => {
    this.setState({ writes: writes, });
    st.saveWrites(writes);
  }

  setDeletes = deletes => {
    this.setState({ deletes: deletes, });
    st.saveDeletes(deletes);
  }

  saveNew = t => {
    this.setState({ newText: newText() });
    this.save(t);
  }

  delText = async t => {
    const texts = st.deleteEntry(this.state.texts.slice(), t);
    this.setTexts(texts);

    if (st.hasEntry(this.state.writes, t)) {
      this.delWrite(t);
      return;
    }

    let deletes = st.putEntry(this.state.deletes.slice(), t)
    this.setDeletes(deletes);

    if (!this.state.offline) {
      deletes = await st.deleteRemote(deletes, t);
      this.setDeletes(deletes);
    }
  }

  delWrite = text => {
    const writes = st.deleteEntry(this.state.writes.slice(), text);
    this.setWrites(writes);
  }

  delDelete = text => {
    const deletes = st.deleteEntry(this.state.deletes.slice(), text);
    this.setDeletes(deletes);
  }

  toggleOffline = () => {
    if (this.state.offline) {
      this.setState({ offline: false });
      st.saveOffline("false");
      this.emptyQueues();
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
            {this.navComp()}
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
