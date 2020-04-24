import React, { createContext, useState, useEffect } from "react";
import emptyText from "../funcs/new";
import { getRemoteTexts, saveRemote, deleteRemote } from "../funcs/remote";
import { updateList, deleteEntry } from "../funcs/list";
import { readState, saveState } from "../funcs/storage";
import { readBoolState, saveBoolState } from "../funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [newText, setNewText] = useState(emptyText());
  const [texts, setTexts] = useState(readState("texts"));
  const [writes, setWrites] = useState(readState("writes"));
  const [deletes, setDeletes] = useState(readState("deletes"));
  const [offline, setOfflineState] = useState(readBoolState("offline"));
  const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

  // set theme

  useEffect(() => {
    darkTheme
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark")
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


  // initial fetch
  
  useEffect((offline, writes, deletes) => {
    if (!offline && isEmpty(writes) && isEmpty(deletes)) {
      getRemoteTexts().then(
        texts => {
          setTexts(texts);
          saveState("texts", texts);
        },
        err => console.log(err)
      );
    }
  }, []);

  // actions

  const saveNewText = t => {
    setNewText(emptyText());
    saveText(t);
  }

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


  // saving functions

  const removeEntry = (key, t) => {
    setList(key, deleteEntry(states[key].state, t))
  }

  const setEntry = (key, t) => {
    setList(key, updateList(states[key].state, t))
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

  const toggleOffline = () => {
    if (offline) {
      emptyQueue();
      setOffline(false);
      return
    }
    setOffline(true);
  }

  // going online

  const isEmpty = list => {
    if (!list) return true
    return list.length === 0
  }

  const emptyQueue = async () => {

    let wrs = writes.slice();
    for (const t of wrs) {
      try {
        await saveRemote(t);
        wrs = deleteEntry(wrs, t);
        setList("writes", wrs);
      } catch(err) {
        setOffline(true);
        console.log(err);
        return;
      }
    }

    let dels = deletes.slice();
    for (const t of dels) {
      try {
        await deleteRemote(t);
        dels = deleteEntry(dels, t)
        setList("deletes", dels)
      } catch(err) {
        setOffline(true);
        console.log(err);
        return;
      }
    }
  }

  return (
    <WriteContext.Provider value={{ 
      texts, writes, deletes,
      revertDelete,
      newText, saveNewText,
      offline, toggleOffline,
      darkTheme, toggleDarkTheme,
      deleteText, saveText
    }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
