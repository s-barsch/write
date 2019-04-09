import * as React from "react";
import Top from "./top";
import Text from "./text";

export default class Locals extends React.Component {
    renderLocals(locals) {
        let els = [];
        let i = 0;
        for (let l of locals) {
            els.push(<Text key={i} file={l}
                delFn={this.props.delFn}
                saveFn={this.props.onBlur}/>);
            console.log(i)
            i++;
        }
        return els;
    }

    render() {
        return(
            <div>
            <Top />
            {console.log(this.props)}
            {this.renderLocals(this.props.locals)}
            </div>
        );
    }
}

