import React from "react";
import { Text, TextView } from "./text";
import { makeNumber } from "../funcs/date";

interface Props {
    texts: Text[];
    //saveFn(e: React.FormEvent<HTMLTextAreaElement>): void;
    saveFn(text: Text): void; 
    delFn(t: Text): void; 
}

interface State {
}

export default class Texts extends React.Component<Props, State> {
    render() {
        if (!this.props.texts) {
            return null
        }
        return(
            this.props.texts.map(text => (
                <TextView key={makeNumber(text.id)} text={text}
                delFn={this.props.delFn}
                saveFn={this.props.delFn} />
            ))
        );
    }
}

