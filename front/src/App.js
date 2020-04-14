import React from "react";
import { Texts, Text} from "./components/text"; 
import newText from "./components/new";
import "./main.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.state = { locals: getLocals() };
  }
  save(t) {
    this.setState({
      locals: appendLocal(this.state.locals.slice(), t)
    });
    console.log(this.state.locals);
  }
  del(t) {
  }

  render () {
    return (
      <div>
        <Text text={newText()} saveFn={this.save} />
        <Texts texts={this.state.locals} saveFn={this.save} delFn={this.del} />
      </div>
    );
  }
}

export default App;

const appendLocal = (texts, t) => {
  texts.push(t);
  saveLocals(texts);
  return texts
}

const localStorageKey = "texts";

const saveLocals = texts => {
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
}


const getLocals = () => {
    let locals = localStorage.getItem(localStorageKey);
    if (locals == null) {
        return [];
    }
    return JSON.parse(locals);
}
