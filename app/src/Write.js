import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.scss";
import Top from "./top";
import NewText from "./comps/sections/new";
import Texts from "./comps/sections/texts";
import Single from "./comps/sections/single";
import Queue from "./comps/sections/queue";
import { updateList, trimList } from "./funcs/list";
import { getRemoteTexts, deleteRemote, saveRemote } from "./funcs/remote";
import { readState, storeState, readBoolState, storeBoolState } from "./funcs/storage";
import { demoText } from './funcs/new';

const Write = () => {

  const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

  // `texts` are the displayed texts within the app.
  // `writes` are queued texts that wait to be saved remotely.
  // `deletes` is the equivalent delete queue.

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

  // load texts when queues are empty
  
  useEffect(() => {
    if (!offline && isEmpty(writes) && isEmpty(deletes)) {
      loadTexts();
    }
  }, [offline, writes, deletes]);


  // load texts when you open the app

  useEffect(() => {
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
  }, [offline]);


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
        await emptyQueues();
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

  // load function

  const loadTexts = () => {
    return new Promise(async (resolve, reject) => {
      // Hooks don’t allow 'setList' and 'setOffline'.
      setConnecting(true);
      await getRemoteTexts().then(
        texts => {
          setConnecting(false);
       // setList("texts", texts)
            setTexts(texts);
            storeState("texts", texts);
          resolve()
        },
        err => {
          setConnecting(false);
       // setOffline(true)
            setOfflineState(true);
            storeBoolState("offline", true);
          reject(err);
        }
      );
    });
  }

  // delete and write queues have to be empty before load

  const emptyQueues = () => {
    return new Promise(async (resolve, reject) => {

      let writeq = writes.slice();
      for (const t of writeq) {
        try {
          await saveRemote(t);
          writeq = trimList(writeq, t);
          setList("writes", writeq);
        } catch(err) {
          reject(err);
        }
      }

      let delq = deletes.slice();
      for (const t of delq) {
        try {
          await deleteRemote(t);
          delq = trimList(delq, t)
          setList("deletes", delq)
        } catch(err) {
          reject(err);
        }
      }
      resolve();
    })
  }

  const isEmpty = list => {
    if (!list) return true
    return list.length === 0
  }

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

  useEffect(() => {
    if (texts.length === 0 && process.env.REACT_APP_IS_DEMO === "true") {
      const demo = [demoText()]
      setTexts(demo);
      storeState("text", demo);
      storeState("writes", demo);
    }
  }, [texts]);


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


export default Write;

