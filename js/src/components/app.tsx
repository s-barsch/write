import React from "react";
import { NavLink, BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import { Text, TextView } from "./text";
import Texts from "./texts";
import * as date from "../funcs/date";
import newText from "./new";

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
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveNew = this.handleSaveNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        let t: Text;
        let ts: Text[];
        this.state = { New: newText(), Locals: ts, Texts: ts};
    }

    componentDidMount() {
        if (this.state.Texts) {
            return
        }
        fetch("/api/texts/")
            .then(response => {
                console.log("refreshed texts");
                return response.json();
            })
            .then(data => this.setState({ Texts: data }));
    }

    handleSave(t: Text) {
    }

    handleDelete(t: Text) {
    }

    handleSaveNew(t: Text) {
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





function Top() {
    return (
        <nav className="nav">
        <NavLink to="/" exact={true} className="homel">Write</NavLink>
        <NavLink to="/texts/" className="textl">Texts</NavLink>
        <NavLink to="/local/" className="locall">Local</NavLink>
        </nav>
    );
}

