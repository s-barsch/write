import React from "react";
import Top from "./top";
import Text from "./text";

export default class Texts extends React.Component {
    renderTexts(texts) {
        let els = [];
        let i = 0;
        for (let t of texts) {
            els.push(<Text key={i} file={t}
                delFn={this.props.delFn}
                saveFn={this.props.onBlur}/>);
            i++;
        }
        return els;
    }

    render() {
        return(
            <div>
            <Top />
            {this.renderTexts(this.props.texts)}
            </div>
        );
    }
}

