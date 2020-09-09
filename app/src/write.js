import React, { createContext, useState, useEffect } from "react";
import { getRemoteTexts, saveRemote, deleteRemote } from "./funcs/remote";
import { updateList, trimList } from "./funcs/list";
import { readState, saveState } from "./funcs/storage";
import { readBoolState, saveBoolState } from "./funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [texts, setTexts] = useState(readState("texts"));
  const [writes, setWrites] = useState(readState("writes"));
  const [deletes, setDeletes] = useState(readState("deletes"));
  const [offline, setOfflineState] = useState(readBoolState("offline"));
  const [connecting, setConnecting] = useState(false);
  const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

  // set theme

  useEffect(() => {
    darkTheme
      ? document.body.classList.add("dark-theme")
      : document.body.classList.remove("dark-theme")
  })

  // map for easy access

  const states = {
    "texts": {
      "state":    texts,
      "setState": setTexts,
    },
    "writes": {
      "state":    writes,
      "setState": setWrites,
    },
    "deletes": {
      "state":    deletes,
      "setState": setDeletes,
    },
  }

  // loading texts
  
  useEffect(() => {

    if (!offline && isEmpty(writes) && isEmpty(deletes)) {
      loadTexts();
    }

    let wasFocus = true;

    const onPageFocusChange = event => {
      if (!offline && !document.hidden && !wasFocus) {
        loadTexts();
      }
      wasFocus = !document.hidden;
    };

    document.addEventListener("visibilitychange", onPageFocusChange);
    
    return () => {
      document.removeEventListener("visibilitychange", onPageFocusChange);
    }
  }, [offline, writes, deletes]);


  // actions

  const saveText = t => {
    setEntry("texts", t)
    setEntry("writes", t)

    if (offline) return;

    saveRemote(t).then(
      () => removeEntry("writes", t),
      err => {
        console.log(err);
        setOffline(true)
      }
    )
  }

  const deleteText = t => {
    removeEntry("texts", t);
    removeEntry("writes", t);
    setEntry("deletes", t);

    if (offline) return;
    
    deleteRemote(t).then(
      () => removeEntry("deletes", t),
      err => {
        console.log(err);
        setOffline(true);
      }
    )
  }

  const revertDelete = t => {
    setEntry("texts", t)
    setEntry("writes", t)
    removeEntry("deletes", t)
  }

  const delWrite = t => {
    removeEntry("writes", t)
  }


  // saving functions

  const removeEntry = (key, t) => {
    setList(key, trimList(states[key].state.slice(), t))
  }

  const setEntry = (key, t) => {
    setList(key, updateList(states[key].state.slice(), t))
  }

  const setList = (key, list) => {
    states[key].setState(list);
    saveState(key, list);
  }
  
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

  // going online
  
  const loadTexts = () => {
    return new Promise(async (resolve, reject) => {
      // Rules of Hooks don’t allow functions "setList" and "setOffline".
      setConnecting(true);
      await getRemoteTexts().then(
        texts => {
          setConnecting(false);
          setTexts(texts);
          saveState("texts", texts);
          resolve()
        },
        err => {
          setConnecting(false);
          setOfflineState(true);
          saveBoolState("offline", true);
          reject(err);
        }
      );
    });
  }

  const isEmpty = list => {
    if (!list) return true
    return list.length === 0
  }

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
