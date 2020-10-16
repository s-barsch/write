import React from 'react';

import { TextList } from "../components/text";

const Texts = ({texts, modFuncs}) => {
  return (
    <TextList texts={texts} saveFn={modFuncs.saveText} delFn={modFuncs.deleteText} />
  )
}

export default Texts;
