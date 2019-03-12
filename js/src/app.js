import React from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import * as date from "./date.js";
//import "./index.css";
import Top from "./top";
import Text from "./text";
import Texts from "./texts";
import Locals from "./locals";

const localStorageName = "local-texts";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        //this.handleBlur = this.handleBlur.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.state = { 
            current: this.newFile(),
            texts: [],
            locals: this.getLocals()
        };
    }

    componentDidMount() {
        console.log("mount");
        fetch("/api/texts/")
            .then(response => response.json())
            .then(texts => {
                    this.setState({
                    texts: texts
                })
                console.log(texts);
            })
            .catch(error => {
                console.log(error);
            });
        ;
    }

    getLocals() {
        let locals = localStorage.getItem(localStorageName);
        if (locals !== null) {
            return JSON.parse(locals);
        }
        return [];
    }

    newFile() {
        return {
            path: date.newPath(),
            body: "",
        }
    }


    handleDelete(f) {
        if (!window.confirm("Delete?")) {
            return;
        }
        let locals = this.state.locals.slice();
        locals = locals.filter(file => file.path !== f.path);
        this.setState({
            locals: locals,
        });
        localStorage.setItem(localStorageName, JSON.stringify(locals));
    }

    handleSave(f) {
        let locals = this.state.locals.slice();
        for (let i = 0; i < locals.length; i++) {
            if (locals[i].path === f.path) {
                locals[i] = f;
                console.log("replaced el");
                break;
            }
            if (i === locals.length - 1) {
                locals = locals.concat(f)
                console.log("was here once");
            }
        }
        if (locals.length === 0) {
            locals = locals.concat(f);
            console.log("first el");
        }
        let current = this.state.current;
        if (current.path === f.path) {
            console.log("changed upper file");
            current = this.newFile();
        }
        localStorage.setItem(localStorageName, JSON.stringify(locals));
        this.setState({
            current: current,
            texts: [],
            locals: locals,
        }, function() {
            console.log(this.state.locals);
        })
    };

    render() {
        return (
            <Router>
            <Switch>
            <Route path="/texts/" render={() => (
                <Texts texts={this.state.texts} onBlur={this.handleSave} delFn={this.handleDelete} />
            )} />
            <Route path="/local/" exact={true} render={() => (
                <Locals locals={this.state.locals} onBlur={this.handleSave} delFn={this.handleDelete} />
            )}/>

            <Route path="/local/:file" render={() => (
                <EditText delFn={this.handleDelete} locals={this.state.locals} saveFn={this.handleSave}/>
            )}/>

            <Route exact={true} path="/" render={() => (
                <Single file={this.state.current} delFn={this.handleDelete} saveFn={this.handleSave} />
            )}/>
            </Switch>
            </Router>
        );
    }
}

 class EditText extends React.Component {
    fetchText(locals) {
        const path = document.location.pathname;
        for (let i = 0; i < locals.length; i++) {
            if (locals[i].path === path) {
                return locals[i];
            }
        }
    }

    render() {
        return(
            <div>
            <Top />
            <Text file={this.fetchText(this.props.locals)}
                  saveFn={this.props.saveFn} delFn={this.props.delFn} />
            </div>
        );
    }
}

class List extends React.Component {
    render() {
        return(
            <div>
            <Top />
            No items here.
            </div>
        );
    }
}

class Single extends React.Component {
    constructor(props) {
        super(props);
        this.handleNewText = this.handleNewText.bind(this);
    }

    handleNewText(f) {
        this.props.saveFn(f);
        document.location = f.path;
    }

    render() {
        return(
            <div>
            <Top />
            <Text file={this.props.file} delFn={this.props.delFn} saveFn={this.handleNewText} />
            </div>
        );
    }
}


