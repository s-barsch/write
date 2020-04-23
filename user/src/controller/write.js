import React, { createContext, useState, useEffect } from "react";
import emptyText from "../funcs/new";
import { getRemoteTexts, saveRemote, deleteRemote } from "../funcs/remote";
import { updateList, deleteEntry } from "../funcs/list";
import { readState, saveState } from "../funcs/storage";
import { readOfflineState, saveOfflineState } from "../funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [newText, setNewText] = useState(emptyText());
  const [texts, setTexts] = useState(readState("texts"));
  const [writes, setWrites] = useState(readState("writes"));
  const [deletes, setDeletes] = useState(readState("deletes"));
  const [offline, setOfflineState] = useState(readOfflineState());

  const hub = {
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
  
  const isEmpty = list => {
    if (!list) return true
    return list.length === 0
  }

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
    setList(key, deleteEntry(hub[key].state, t))
  }

  const setEntry = (key, t) => {
    setList(key, updateList(hub[key].state, t))
  }

  const setList = (key, list) => {
    hub[key].setState(list);
    saveState(key, list);
  }

  // offline state

  const setOffline = state => {
    setOfflineState(state);
    saveOfflineState(state);
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

  const emptyQueue = async () => {

    let writesArr = writes.slice();
    for (const t of writesArr) {
      try {
        await saveRemote(t);
        writesArr = deleteEntry(writesArr, t)
        setList("writes", writesArr)
      } catch(err) {
        setOffline(true);
        console.log(err);
        return;
      }
    }

    let deletesArr = deletes.slice();
    for (const t of deletesArr) {
      try {
        await deleteRemote(t);
        deletesArr = deleteEntry(deletesArr, t)
        setList("deletes", deletesArr)
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
      deleteText, saveText
    }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
