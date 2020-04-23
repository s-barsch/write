import React from 'react';

import emptyText from "../funcs/new";
import { makeKey } from "../funcs/date";

import { Text } from "../components/text";

const NewText = () => {
  const newText = emptyText();
  return (
    <Text id={makeKey(newText.id)} text={newText} />
  )
}

export default NewText;
