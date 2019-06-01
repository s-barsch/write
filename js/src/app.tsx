import React from "react";
import { NavLink, BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Text, TextView } from "./text";
import Texts from "./texts";
import * as date from "./date";

interface Props {
}

interface State {
    Current: Text;
    Locals:  Text[];
    Texts:   Text[];
}

export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.refreshCurrent = this.refreshCurrent.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveCurrent = this.handleSaveCurrent.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        // current: this.newText(),
        console.log(getLocals());
        let t: Text;
        let ts: Text[];
        this.state = { Current: this.newText(), Locals: getLocals(), Texts: ts};
    }

    componentDidMount() {
        if (this.state.Texts) {
            return
        }
        fetch("/api/texts/")
            .then(response => response.json())
            .then(data => this.setState({ Texts: data }));
    }

    newText() {
        const ts = date.timestamp();
        const path = date.makePath(ts);
        return {
            id:   ts,
            path: path,
            body: "",
        }
    }

    handleSave(id: string, body: string) {
        let locals = saveBody(this.state.Locals.slice(), id, body)
        this.setState({
            Locals: locals,
        });
        saveLocals(locals);
    }

    handleSaveCurrent(id: string, body: string) {
        const t: Text = { id: id, path: date.makePath(id), body: body };
        const locals = [t].concat(this.state.Locals.slice());
        this.setState({
            Locals: locals,
            Texts:  [t].concat(this.state.Texts.slice()),
            Current: this.newText()
        });
        saveLocals(locals);
    }

    handleDelete(t: Text) {
        /*
        if (!window.confirm("Delete?")) {
            return;
        }
        */
        let locals = this.state.Locals.slice()
        locals = locals.filter(file => file.path !== t.path);
        this.setState({
            Locals: locals,
        });
        localStorage.setItem(localStorageKey, JSON.stringify(locals));
    }

    refreshCurrent() {
        this.setState({
            Current: this.newText()
        });
    }

    render() {
        return (
            <Router>
            <Switch>
            <Route path="/local/" exact={true} render={() => (
                <div>
                    <Top />
                    <Texts texts={this.state.Locals} saveFn={this.handleSave} delFn={this.handleDelete} />
                </div>
            )}/>
            <Route path="/local/:file" render={() => (
                <div>
                    <Top />
                    FILE VIEW.
                </div>
            )}/>
            <Route path="/texts/" exact={true} render={() => (
                <div>
                    <Top />
                    {/*
                    <br />
                    Text Listings here.
                    */}
                    <Texts texts={this.state.Texts} saveFn={this.handleSave} delFn={this.handleDelete} />
                </div>
            )}/>
            <Route exact={true} path="/" render={() => (
                <div>
                    <Top />
                    <TextView key={date.makeNumber(this.state.Current.id)} text={this.state.Current} saveFn={this.handleSaveCurrent} delFn={this.handleDelete} />
                </div>
            )}/>
            </Switch>
            </Router>
        );
    }
}

const localStorageKey = "local-texts";

function saveLocals(texts: Text[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
}

/*
function addText(locals: Text[], id: number, body: string): Text[] {
}
*/

function getLocals(): Text[] {
    let locals = localStorage.getItem(localStorageKey);
    if (locals == null) {
        return [] as Text[];
    }
    return JSON.parse(locals);
}

function saveBody(locals: Text[], id: string, body: string): Text[] {
    for (let i = 0; i < locals.length; i++) {
        if (locals[i].id === id) {
            locals[i].body = body;
            return locals
        }
    }
    return locals
}

function Top() {
    return (
        <nav className="nav">
        <NavLink to="/" exact={true} className="homel">Write</NavLink>
        <NavLink to="/texts/" className="textl">Texts</NavLink>
        <NavLink to="/local/" className="locall">Local</NavLink>
        </nav>
    );
}

function onStorageChange(evt: StorageEvent) {
    console.log(evt);
}
