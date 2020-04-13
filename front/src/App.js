import React from "react";
import Text from "./components/text"; 
import newText from "./components/new";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.state = { locals: [] };
  }
  save(t) {
    this.setState({
      locals: appendLocal(this.state.locals.slice(), t)
    });
    console.log(this.state.locals);
  }

  render () {
    return (
        <Text saveFn={this.save} text={newText()} />
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


