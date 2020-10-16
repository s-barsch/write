import React from 'react';

import { TextList } from "../components/text";

const Texts = ({texts, saveText, deleteText}) => {
  console.log(texts);
  //const { texts, saveText, deleteText } = useContext(WriteContext);
  return (
    <TextList texts={texts} saveFn={saveText} delFn={deleteText} />
  )
}

export default Texts;
