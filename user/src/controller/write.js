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

  const isEmpty = list => {
    if (!list) return false
    return list.length === 0
  }

  useEffect((offline, writes, deletes) => {
    if (!offline && isEmpty(writes) && isEmpty(deletes)) {
      getRemoteTexts().then(
        texts => setTexts(texts),
        err => console.log(err)
      );
    }
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

  const revertDelete = t => {
    setText(t);
    setWrite(t);
    setDeleteRemove(t);
  }
  
  // remove from list

  const setTextRemove = t => {
    setTexts(deleteEntry(texts, t))
  }

  const setWriteRemove = t => {
    setWrites(deleteEntry(writes, t))
  }

  const setDeleteRemove = t => {
    setDeletes(deleteEntry(deletes, t))
  }

  // set element

  const setText = t => {
    setTexts(updateList(texts, t))
  }

  const setWrite = t => {
    setWrites(updateList(writes, t))
  }

  const setDelete = t => {
    setDeletes(updateList(deletes, t))
  }

  // set state and save list

  const setDeletes = deletes => {
    setDeletesState(deletes);
    saveDeletesState(deletes);
  }

  const setWrites = writes => {
    setWritesState(writes);
    saveWritesState(writes);
  }

  const setTexts = texts => {
    setTextsState(texts);
    saveTextsState(texts);
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
    let writesCopy = writes.slice();
    for (const t of writesCopy) {
      try {
        await saveRemote(t);
        writesCopy = deleteEntry(writesCopy, t)
        setWrites(writesCopy)
      } catch(err) {
        setOffline(true);
        console.log(err);
        return;
      }
    }
    let deletesCopy = deletes.slice();
    for (const t of deletesCopy) {
      try {
        await deleteRemote(t);
        deletesCopy = deleteEntry(deletesCopy, t)
        setDeletes(deletesCopy)
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
