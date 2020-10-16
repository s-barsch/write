import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch }  from "react-router-dom";
import "./main.scss";
import Top from "./top";
import NewText from "./sections/new";
import Texts from "./sections/texts";
import Single from "./sections/single";
/*
import Queue from "./sections/queue";
import WriteProvider from "./write";
*/
import { getRemoteTexts } from "./funcs/remote";
import { readState, storeState, storeBoolState } from "./funcs/storage";

const App = () => {
  /*
  // `texts` are the displayed texts within the app.
  // `writes` are queued texts that wait to be saved remotely.
  // `delete` is the equivalent delete queue.

  */

  const [texts, setTexts] = useState(readState("texts"));

  /*
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
    saveState(key, list);
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

*/
  const loadTexts = () => {
    return new Promise(async (resolve, reject) => {
      //setConnecting(true);
      await getRemoteTexts().then(
        texts => {
          //setConnecting(false);
          setTexts(texts);
          storeState("texts", texts);
          resolve()
        },
        err => {
          //setConnecting(false);
          //setOfflineState(true);
          storeBoolState("offline", true);
          reject(err);
        }
      );
    });
  }

  useEffect(() => {
    loadTexts();
  }, []) 

  console.log(texts);

  return (
    <Router>
      <Top />
      <Switch>
        <Route exact={true} path="/">
          <NewText />
        </Route>
        <Route path="/texts/:name">
          <Single texts={texts} />
        </Route>
        <Route path="/texts/">
          <Texts texts={texts} />
        </Route>
      </Switch>
    </Router>
    /*
    <Router>
    <WriteProvider>

        <Top />
        <Switch>
          <Route exact={true} path="/">
            <NewText />
          </Route>

          <Route path="/texts/:name">
            <Single />
          </Route>

          <Route path="/texts/">
            <Texts />
          </Route>

          <Route path="/queue/">
            <Queue />
          </Route>
        </Switch>

    </WriteProvider>
    </Router>
    */
  );
}


export default App;
