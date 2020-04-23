import React, { createContext, useEffect, useState, useReducer } from "react";
import { reducer } from "./reducer";
import * as st from "../funcs/store";
import emptyText from "../funcs/new";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, dispatch] = useReducer(reducer, st.readTexts());
  const [newText, setNewText] = useState(emptyText());

  useEffect(() => {
    setNewText(emptyText())
  }, [])

  return (
    <WriteContext.Provider value={{ texts, dispatch, newText }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
