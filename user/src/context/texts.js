import React, { createContext, useReducer } from "react";
import { reducer } from "./reducer";
import * as st from "../components/store.js";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, dispatch] = useReducer(reducer, st.readTexts());

  return (
    <WriteContext.Provider value={{ texts, dispatch }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
