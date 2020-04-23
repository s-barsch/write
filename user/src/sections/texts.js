import React, { useContext} from 'react';

import { WriteContext } from "../context/texts";
import { TextList } from "../components/text";

const Texts = () => {
  const { texts } = useContext(WriteContext);
  return (
    <TextList texts={texts} />
  )
}

export default Texts;
