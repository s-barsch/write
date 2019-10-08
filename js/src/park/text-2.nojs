"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_autosize_textarea_1 = require("react-autosize-textarea");
//export class TextView extends React.Component<TextProps, TextState> {
function TextView(props) {
    var name = function (path) {
        return path.substr(path.lastIndexOf('/') + 1);
    };
    var submit = function (e) {
        props.saveFn(props.text.id, e.target.value);
    };
    return (<div>
        <react_router_dom_1.Link to={props.text.path}>{props.text.id}</react_router_dom_1.Link>
        <br />
        <react_autosize_textarea_1["default"] className="textarea" defaultValue={props.text.body} rows={3} onBlur={submit}/>
        <span className="del" onClick={function () { return props.delFn(props.text); }}>DEL</span>
        </div>);
    /*
        constructor(props: TextProps) {
            super(props);
            this.handleUpdate = this.handleUpdate.bind(this);
        }
    
        handleUpdate(e: React.FormEvent<HTMLTextAreaElement>) {
            let t = this.props.text;
            t.body = (e.target as HTMLTextAreaElement).value;
            this.props.saveFn(t);
        }
        render() {
            return (
            )
        }
    
    */
}
exports.TextView = TextView;
