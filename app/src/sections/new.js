import React, { useContext } from 'react';
import { WriteContext } from "../controller/write";
import { Text } from "../components/text";
import { makeKey } from "../funcs/date";

const NewText = () => {
  const { newText, saveNewText } = useContext(WriteContext);
  return (
    <Text key={makeKey(newText.id)} text={newText} saveFn={saveNewText} />
  )
}

export default NewText;
