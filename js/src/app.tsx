import React from "react";
import { NavLink, BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Text, TextView } from "./text";
import Texts from "./texts";
import * as date from "./date";

interface Props {
}

interface State {
    New: Text;
    Locals:  Text[];
    Texts:   Text[];
}

export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.refreshNew = this.refreshNew.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveNew = this.handleSaveNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        let t: Text;
        let ts: Text[];
        this.state = { New: this.newText(), Locals: getLocals(), Texts: ts};
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
        //let d = new Date
        return {
            id:   ts,
            path: path,
            body: "",
            mod:  new Date().getTime()
        }
    }

    saveToLocals(t: Text) {
         return new Promise(function(resolve, reject) {
             resolve();
         });
    }

    removeFromLocals(t: Text) {
         return new Promise(function(resolve, reject) {
             resolve();
         });
    }

    saveToRemote(t: Text) {
        return new Promise(function(resolve, reject) {
            fetch("/api/text/" + t.id + ".txt", {
                method: "PUT",
                body: t.body
            }).then(
                response => resolve(response)
            )
            .catch(
                error => reject(error)
            );
        });
    }

    handleSave(t: Text) {
        this.saveToLocals(t)
        .then( () => this.saveToRemote(t) )
        .then( response => this.removeFromLocals(t));
   
        //saveText(id, body);
        /*
        let locals = saveBody(this.state.Locals.slice(), id, body)
        this.setState({
            Locals: locals,
        });
        saveLocals(locals);
        */
    }

    //handleSaveNew(id: string, body: string) {
    handleSaveNew(t: Text) {
        if (t.body == "") {
            return
        }
        /*
        const t: Text = { id: id, path: date.makePath(id), mod: new Date().getTime(), body: body };
        const locals = [t].concat(this.state.Locals.slice());
        this.setState({
            Locals: locals,
            //[t].concat(this.state.Texts.slice()),
            New: this.newText()
        });
        saveLocals(locals);
        */
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

    refreshNew() {
        this.setState({
            New: this.newText()
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
                    <TextView key={date.makeNumber(this.state.New.id)} text={this.state.New} saveFn={this.handleSaveNew} delFn={this.handleDelete} />
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

function saveText(id: string, body: string) {

    /*
    fetch("/api/text/" + id + ".txt", {
        method: "PUT",
        body: body
    }).then( response => console.log(response))
    .catch( error => console.log(error));
    */
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
