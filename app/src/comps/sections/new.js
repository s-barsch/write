import React, { useState, useEffect } from 'react';
import { Text } from "../text";
import { makeKey } from "../../funcs/date";
import emptyText from "../../funcs/new";
import { useHistory } from "react-router-dom";

const NewText = ({modFuncs}) => {
  const [newText, setNewText] = useState(emptyText());

  useEffect(() => {
    let wasFocus = true;

    const onFocusChange = event => {
      if (!wasFocus) {
        setNewText(emptyText());
      }
      wasFocus = !document.hidden;
    };

    document.addEventListener("visibilitychange", onFocusChange);
    
    return () => {
      document.removeEventListener("visibilitychange", onFocusChange);
    }
  }, []);

  const history = useHistory();

  const save = t => {
    setNewText(emptyText());
    modFuncs.saveText(t);
    history.push("/texts/" + t.id + ".txt");
  }

  return (
    <Text key={makeKey(newText.id)} text={newText} saveFn={save} minRows={20} focus={true} />
  )
}

export default NewText;
