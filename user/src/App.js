import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Texts, Text} from "./components/text"; 
import * as st from "./components/store.js";
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
    offline: st.readOffline(),
    error: "",
  };

  log = msg => {
    console.log(msg);
    this.setState({ error: msg })
  }

  componentDidMount = async () => {
    if (!this.state.offline && this.queuesEmpty()) {
      try {
        const resp = await fetch(st.server + "/api/texts/");
        if (resp.ok) {
          const texts = await resp.json();
          this.setTexts(texts);
        } else {
          this.setOffline(true)
        }
      } catch(err) {
        this.log(err);
      }
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
      try {
        writes = await st.saveRemote(writes, text)
        this.setWrites(writes);
      } catch(err) {
          this.log(err);
          this.setOffline(true);
          return
      }
    }

    let deletes = this.state.deletes.slice();
    for (const text of deletes) {
      try {
        deletes = await st.deleteRemote(deletes, text)
        this.setDeletes(deletes);
      } catch(err) {
          this.log(err);
          this.setOffline(true);
          return
      }
    }
  }

  save = async text => {
    this.putTexts(text)

    let writes = this.putWrites(text);

    if (!this.state.offline) {
      st.saveRemote(writes, text).then(
        writes => this.setWrites(writes),
        err => {
          this.log(err);
          this.setOffline(true)
        }
      )
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

  saveNew = text => {
    this.setState({ newText: newText() });
    this.save(text);
  }

  delText = async text => {
    const texts = st.deleteEntry(this.state.texts.slice(), text);
    this.setTexts(texts);

    if (st.hasEntry(this.state.writes, text)) {
      this.delWrite(text);
      return;
    }

    let deletes = st.putEntry(this.state.deletes.slice(), text)
    this.setDeletes(deletes);

    if (!this.state.offline) {
      st.deleteRemote(deletes, text).then(
        deletes => this.setDeletes(deletes),
        err => {
          this.log("was here");
          this.setOffline(true);
        }
      );
    }
  }

  delWrite = text => {
    const texts = st.deleteEntry(this.state.texts.slice(), text);
    this.setTexts(texts);

    const writes = st.deleteEntry(this.state.writes.slice(), text);
    this.setWrites(writes);
  }

  delDelete = text => {
    const texts = st.deleteEntry(this.state.texts.slice(), text);
    this.setTexts(texts);

    const deletes = st.deleteEntry(this.state.deletes.slice(), text);
    this.setDeletes(deletes);
  }

  setOffline = state => {
    this.setState({ offline: state });
    st.saveOffline(state.toString());
  }

  toggleOffline = () => {
    if (this.state.offline) {
      this.setOffline(false);
      this.emptyQueues();
      return
    }
    this.setOffline(true)
  }

  navComp = () => {
    return (
      <div>
        <Top offlineStatus={this.state.offline} offlineToggle={this.toggleOffline} />
        <span>{this.state.error}</span>
      </div>
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
        <Route path="/queue/" exact={true} render={() => (
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
