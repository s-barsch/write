import React, { useContext} from 'react';
import { makeKey } from "../funcs/date";
import { useParams } from "react-router-dom";

import { WriteContext } from "../controller/write";
import { Text } from "../components/text";
import Error from '../components/error';

const Single = () => {
  const { texts, saveText, deleteText } = useContext(WriteContext);
  const { name } = useParams();

  const id = name.substr(0, name.lastIndexOf("."))
  const text = texts.find((t) => t.id === id);

  if (!text) {
    return (
      <Error message={
        <>
          Text <samp>{name}</samp> not found.
        </>
      } />
    )
  }

  return (
    <Text key={makeKey(text.id)} text={text} saveFn={saveText} delFn={deleteText}
    minRows={20} focus={true} />
  )
}

export default Single;
