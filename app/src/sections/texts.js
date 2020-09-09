import React, { useContext} from 'react';

import { WriteContext } from "../write";
import { TextList } from "../components/text";

const Texts = () => {
  const { texts, saveText, deleteText } = useContext(WriteContext);
  return (
    <TextList texts={texts} saveFn={saveText} delFn={deleteText} />
  )
}

export default Texts;
