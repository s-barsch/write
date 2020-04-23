import React, { createContext, useState, useReducer } from "react";
import { reducer } from "./reducer";
import * as st from "../funcs/store";
import { readOfflineState, saveOfflineState } from "../funcs/store";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, dispatch] = useReducer(reducer, st.readTexts());
  const [offline, setOfflineState] = useState(readOfflineState());

  const setOffline = (state) => {
    setOfflineState(state);
    saveOfflineState(state);
  }

  const toggleOffline = () => {
    setOffline(!offline);
  }

  return (
    <WriteContext.Provider value={{ offline, toggleOffline, texts, dispatch }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
