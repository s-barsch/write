import React, { useContext} from 'react';

import { WriteContext } from "../controller/write";
import { TextList } from "../components/text";

const Texts = () => {
  const { texts } = useContext(WriteContext);
  return (
    <TextList texts={texts} />
  )
}

export default Texts;
