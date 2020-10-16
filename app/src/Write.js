import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.scss";
import Top from "./top";
import NewText from "./sections/new";
import Texts from "./sections/texts";
import Single from "./sections/single";
import Queue from "./sections/queue";
import { updateList, trimList } from "./funcs/list";
import { getRemoteTexts, deleteRemote, saveRemote } from "./funcs/remote";
import { readState, storeState, readBoolState, storeBoolState } from "./funcs/storage";

const App = () => {

  const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

  // `texts` are the displayed texts within the app.
  // `writes` are queued texts that wait to be saved remotely.
  // `delete` is the equivalent delete queue.

  const [texts, setTexts] = useState(readState("texts"));
  const [writes, setWrites] = useState(readState("writes"));
  const [deletes, setDeletes] = useState(readState("deletes"));

  // map states for easy access

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

  const switchTheme = () => {
    setDarkTheme(!darkTheme);
    storeBoolState("dark-theme", !darkTheme);
  }



  // offline state

  const setOffline = state => {
    setOfflineState(state);
    storeBoolState("offline", state);
  }

  const switchConnection = async () => {
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

  // load texts conditionally
  
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


  // write and delete actions

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

  // underlying saving functions

  const removeEntry = (key, t) => {
    setList(key, trimList(states[key].state.slice(), t))
  }

  const setEntry = (key, t) => {
    setList(key, updateList(states[key].state.slice(), t))
  }

  const setList = (key, list) => {
    states[key].setState(list);
    storeState(key, list);
  }

  const loadTexts = () => {
    return new Promise(async (resolve, reject) => {
      // Hooks don’t allow functions "setList" and "setOffline".
      setConnecting(true);
      await getRemoteTexts().then(
        texts => {
          setConnecting(false);
          setTexts(texts);
          storeState("texts", texts);
          resolve()
        },
        err => {
          setConnecting(false);
          setOfflineState(true);
          storeBoolState("offline", true);
          reject(err);
        }
      );
    });
  }

  useEffect(() => {
    loadTexts();
  }, []) 

  const conStates = {
    offline:    offline,
    connecting: connecting,
  }

  const switchFuncs = {
    connection: switchConnection,
    theme: switchTheme
  }

  const modFuncs = {
    saveText: saveText,
    deleteText: deleteText,
    revertDelete: revertDelete,
    delWrite: delWrite
  }


  return (
    <Router>
      <Top conStates={conStates} switchFuncs={switchFuncs} />
      <Switch>
        <Route exact={true} path="/">
          <NewText modFuncs={modFuncs} />
        </Route>
        <Route path="/texts/:name">
          <Single texts={texts} modFuncs={modFuncs} />
        </Route>
        <Route path="/texts/">
          <Texts texts={texts} modFuncs={modFuncs} />
        </Route>
        <Route path="/queue/">
          <Queue writes={writes} deletes={deletes} modFuncs={modFuncs} />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;


