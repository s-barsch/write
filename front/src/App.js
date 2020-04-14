import React from "react";
import { Texts, Text} from "./components/text"; 
import { appendLocal, deleteLocal, saveLocal, getLocals } from "./components/storage.js";
import newText from "./components/new";
import { makeNumber } from "./components/date";
import "./main.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.del = this.del.bind(this);
    this.state = {
      newText: newText(),
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
      <div>
        <Text key={makeNumber(this.state.newText.id)} text={this.state.newText} saveFn={this.saveNew} />
        <Texts texts={this.state.locals} saveFn={this.save} delFn={this.del} />
      </div>
    );
  }
}

export default App;
