import React from "react";
import { Text, TextView } from "./text";
import { makeNumber } from "./date";

interface Props {
    texts: Text[];
    //saveFn(e: React.FormEvent<HTMLTextAreaElement>): void;
    saveFn(id: string, body: string): void; 
    delFn(t: Text): void; 
}

interface State {
}

export default class Texts extends React.Component<Props, State> {
    renderTexts(texts: Text[]) {
        let els = [];
        let i = 0;
        for (let t of texts) {
            els.push(<TextView key={makeNumber(t.id)} text={t}
                delFn={this.props.delFn}
                saveFn={this.props.saveFn}/>);
            i++;
        }
        return els;
    }

    render() {
        return(
            <div>
            {this.renderTexts(this.props.texts)}
            </div>
        );
    }
}

