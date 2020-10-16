import React, { createContext, useState, useEffect } from "react";
import { getRemoteTexts, saveRemote, deleteRemote } from "./funcs/remote";
import { updateList, trimList } from "./funcs/list";
import { readState, saveState } from "./funcs/storage";
import { readBoolState, saveBoolState } from "./funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {

  const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

  // connection states

  const [offline, setOfflineState] = useState(readBoolState("offline"));
  const [connecting, setConnecting] = useState(false);

  // set theme based on setting

  useEffect(() => {
    darkTheme
      ? document.body.classList.add("dark-theme")
      : document.body.classList.remove("dark-theme")
  })


  // dark theme

  const toggleDarkTheme = () => {
    setDarkTheme(!darkTheme);
    saveBoolState("dark-theme", !darkTheme);
  }


  // offline state

  const setOffline = state => {
    setOfflineState(state);
    saveBoolState("offline", state);
  }

  const toggleOffline = async () => {
    if (offline) {
      setConnecting(true);
      try {
        await emptyQueue();
        await loadTexts();
        setOffline(false);
      } catch(err) {
        console.log(err);
      }
      setConnecting(false);
      return;
    }
    setOffline(true);
  }

  const isEmpty = list => {
    if (!list) return true
    return list.length === 0
  }

  // delete and write queues have to be empty before load

  const emptyQueue = () => {
    return new Promise(async (resolve, reject) => {
      let wrs = writes.slice();
      for (const t of wrs) {
        try {
          await saveRemote(t);
          wrs = trimList(wrs, t);
          setList("writes", wrs);
        } catch(err) {
          reject(err);
        }
      }

      let dels = deletes.slice();
      for (const t of dels) {
        try {
          await deleteRemote(t);
          dels = trimList(dels, t)
          setList("deletes", dels)
        } catch(err) {
          reject(err);
        }
      }
      resolve();
    })
  }

  return (
    <WriteContext.Provider value={{ 
      texts, writes, deletes,
      delWrite, revertDelete,
      connecting, offline, toggleOffline,
      darkTheme, toggleDarkTheme,
      deleteText, saveText
    }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
