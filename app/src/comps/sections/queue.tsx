import React from 'react';
import { TextList } from "../text";

const Queue = ({writes, deletes, modFuncs}) => {
    return (
        <section>
        { writes.length > 0 && "Writes:"}
        <TextList texts={writes} saveFn={modFuncs.saveText} delFn={modFuncs.delWrite} />
        { deletes.length > 0 && "Deletes:"}
        <TextList texts={deletes} saveFn={modFuncs.saveText} delFn={modFuncs.revertDelete} />
        </section>
    )
}

export default Queue
