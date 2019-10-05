import React from "react";
import { Link }  from "react-router-dom";
import TextareaAutosize from "react-autosize-textarea";

export interface Text {
    id:   string;
    path: string;
    body: string;
    mod:  number;
}

interface TextProps {
    key:  number;
    text: Text;
    saveFn(text: Text): void; 
    //saveFn(e: React.FormEvent<HTMLTextAreaElement>): void;
    //saveFn(t: Text): void; 
    delFn(t: Text): void; 
}

interface TextState {
    text: Text;
}

function displayDate(date: number): string {
    let d = new Date(date);
    return d.getFullYear() +
           "-" +
           (d.getMonth() + 1) +
           "-" +
           d.getDate() +
           "  " +
           d.getHours() +
           ":" +
           d.getMinutes() +
           ":" +
           d.getSeconds();
}

//export class TextView extends React.Component<TextProps, TextState> {
export function TextView(props: TextProps) {
    const name = (path: string) => {
        return path.substr(path.lastIndexOf('/') + 1);
    }
    const submit = (e: React.FormEvent<HTMLTextAreaElement>) => {
        let body = (e.target as HTMLTextAreaElement).value;
        if (props.text.body == body ) {
            return
        }
        props.text.mod =  new Date().getTime();
        props.text.body = body;
        props.saveFn(props.text)
    }
    return (
        <div>
        <Link to={props.text.path}>{props.text.id}</Link>
        &nbsp;mod: {displayDate(props.text.mod)}
        <br />
        <TextareaAutosize className="textarea"
        defaultValue={props.text.body}
        rows={3}
        onBlur={submit} 
        />
        <span className="del" onClick={() => props.delFn(props.text)}>DEL</span>
        </div>
    );
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
