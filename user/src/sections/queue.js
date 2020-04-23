import React, { useContext} from 'react';

import { WriteContext } from "../controller/write";
import { TextList } from "../components/text";

const Queue = () => {
  const { writes, deletes, saveText, revertDelete } = useContext(WriteContext);
  return (
    <section>
      { writes.length > 0 && "Writes:"}
      <TextList texts={writes} saveFn={saveText}  />
      { deletes.length > 0 && "Deletes:"}
      <TextList texts={deletes} saveFn={saveText} delFn={revertDelete} />
    </section>
  )
}

export default Queue
