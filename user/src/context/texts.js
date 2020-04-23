import React, { createContext, useState, useReducer } from "react";
import { reducer } from "./reducer";
import * as st from "../funcs/store";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, dispatch] = useReducer(reducer, st.readTexts());
  const [offline, setOfflineState] = useState(false);

  const toggleOffline = () => {
    setOfflineState(!offline);
  }

  return (
    <WriteContext.Provider value={{ offline, toggleOffline, texts, dispatch }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
