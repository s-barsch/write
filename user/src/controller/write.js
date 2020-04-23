import React, { createContext, useState } from "react";
import { updateList } from "../funcs/storage";
import { readTextsState, saveTextsState } from "../funcs/storage";
import { readOfflineState, saveOfflineState } from "../funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, setTextsState] = useState(readTextsState());
  const [offline, setOfflineState] = useState(readOfflineState());

  const saveText = t => {
    setText(t);
  }

  const setText = t => {
    setTexts(updateList(texts, t))
  }

  const setTexts = texts => {
    setTextsState(texts);
    saveTextsState(texts);
  }

  const setOffline = state => {
    setOfflineState(state);
    saveOfflineState(state);
  }

  const toggleOffline = () => {
    setOffline(!offline);
  }

  return (
    <WriteContext.Provider value={{ offline, toggleOffline, saveText, texts }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
