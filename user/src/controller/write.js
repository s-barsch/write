import React, { createContext, useState, useEffect } from "react";
import emptyText from "../funcs/new";
import { getRemoteTexts, saveRemote, deleteRemote } from "../funcs/remote";
import { updateList, deleteEntry } from "../funcs/list";
import { readTextsState, saveTextsState } from "../funcs/storage";
import { readWritesState, saveWritesState } from "../funcs/storage";
import { readDeletesState, saveDeletesState } from "../funcs/storage";
import { readOfflineState, saveOfflineState } from "../funcs/storage";

export const WriteContext = createContext();

const WriteProvider = ({ children }) => {
  const [newText, setNewTextState] = useState(emptyText());
  const [texts, setTextsState] = useState(readTextsState());
  const [writes, setWritesState] = useState(readWritesState());
  const [deletes, setDeletesState] = useState(readDeletesState());
  const [offline, setOfflineState] = useState(readOfflineState());

  const queuesEmpty = () => {
    if (writes.length === 0 && deletes.length === 0) {
      return true
    }
    return false
  }

  useEffect(() => {
    getRemoteTexts().then(
      texts => setTexts(texts),
      err => console.log(err)
    );
  }, []);

  const saveNewText = t => {
    setNewTextState(emptyText());
    saveText(t);
  }

  const saveText = t => {
    setText(t);
    setWrite(t);

    if (offline) return;

    saveRemote(t).then(
      () => setWriteRemove(t),
      err => {
        console.log(err);
        setOffline(true)
      }
    )
  }

  const deleteText = t => {
    setTextRemove(t);
    setWriteRemove(t);
    setDelete(t);

    if (offline) return;
    
    deleteRemote(t).then(
      () => setDeleteRemove(t),
      err => {
        console.log(err);
        setOffline(true);
      }
    )
  }
  
  const setTextRemove = t => {
    setTexts(deleteEntry(texts, t))
  }

  const setWriteRemove = t => {
    setWrites(deleteEntry(writes, t))
  }

  const setDeleteRemove = t => {
    setDeletes(deleteEntry(deletes, t))
  }

  const setDelete = t => {
    setDeletes(updateList(deletes, t))
  }

  const setDeletes = deletes => {
    setDeletesState(deletes);
    saveDeletesState(deletes);
  }

  const setWrite = t => {
    setWrites(updateList(writes, t))
  }

  const setWrites = writes => {
    setWritesState(writes);
    saveWritesState(writes);
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
    <WriteContext.Provider value={{ 
      texts,
      newText, saveNewText,
      offline, toggleOffline,
      deleteText, saveText
    }}>
      {children}
    </WriteContext.Provider>
  );
};

export default WriteProvider; 
