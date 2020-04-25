import React, { useContext} from 'react';
import { makeKey } from "../funcs/date";
import { useParams } from "react-router-dom";

import { WriteContext } from "../controller/write";
import { Text } from "../components/text";

const Single = () => {
  const { texts, saveText, deleteText } = useContext(WriteContext);
  const { name } = useParams();

  const id = name.substr(0, name.lastIndexOf("."))
  const text = texts.find((t) => t.id === id);

  return (
    <Text key={makeKey(text.id)} text={text} saveFn={saveText} delFn={deleteText} />
  )
}

export default Single;
