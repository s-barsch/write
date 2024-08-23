import React from 'react';
import { TextList } from '../text';

import Text from '../../funcs/text';
import useWriteStore from 'stores/states';

type QueueProps = {
    writes: Text[];
    deletes: Text[];
}

function Queue() {
    const { states, saveText, delWrite, revertDelete } = useWriteStore()
    let writes = states["writes"];
    let deletes = states["deletes"];
    return (
        <section>
        { writes.length > 0 && "Writes:"}
        <TextList texts={writes} saveFn={saveText} delFn={delWrite} />
        { deletes.length > 0 && "Deletes:"}
        <TextList texts={deletes} saveFn={saveText} delFn={revertDelete} />
        </section>
    )
}

export default Queue
