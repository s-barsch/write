import React from "react";
import { Link }  from "react-router-dom";
import TextareaAutosize from "react-autosize-textarea";

export default class Text extends React.Component {
    constructor(props) {
        super(props);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            file: this.props.file,
        };
    }

    handleBodyChange(e) {
        let f = this.state.file;
        if (f.path !== this.props.file.path) {
            f = this.props.file;
        }
        f.body = e.target.value;
        this.setState({
            file: f,
        });
    }

    handleUpdate(e) {
        this.props.saveFn(this.state.file);
        this.setState({
            file: this.props.file,
        }, function() {
            this.forceUpdate();
        });
    }


    render() {
        return (
            <div className="text">

            <Link to={this.props.file.path}>{baseName(this.props.file.path)}</Link>
            <span className="del" onClick={() => this.props.delFn(this.props.file)}>Delete</span>
            <br />
            <Textarea file={this.props.file}
            onChange={this.handleBodyChange}
            onBlur={this.handleUpdate} />

            </div>
        );
    }
}

function baseName(path) {
    const i = path.lastIndexOf("/") + 1;
    return path.substr(i)
}

function Textarea(props) {
    return (
        <div className="textinput">
            <TextareaAutosize className="textarea"
            defaultValue={props.file.body}
            rows={3}
            onChange={props.onChange}
            onBlur={props.onBlur} />
        </div>
    )
}

