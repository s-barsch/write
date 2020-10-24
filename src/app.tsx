import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';
import './main.scss';
import Top from './comps/top/top';
import NewText from './comps/sections/new';
import Texts from './comps/sections/texts';
import Single from './comps/sections/single';
import Queue from './comps/sections/queue';
import { updateList, trimList } from './funcs/list';
import { getRemoteTexts, deleteRemote, saveRemote, reqErr } from './funcs/remote';
import { readState, storeState, readBoolState, storeBoolState } from './funcs/storage';
import Text, { demoText } from './funcs/text';

type States = {
    [key: string]: StateObject;
}

type StateObject = {
    state: Text[];
    setState: React.Dispatch<React.SetStateAction<Text[]>>;
}

export default function Write() {

    const [err, setErr] = useState({} as reqErr);

    // `texts` are the displayed texts within the app.
    // `writes` are queued texts that wait to be saved remotely.
    // `deletes` is the equivalent delete queue.

    const [texts, setTexts] = useState(readState("texts"));
    const [writes, setWrites] = useState(readState("writes"));
    const [deletes, setDeletes] = useState(readState("deletes"));

    // map states for easy access

    const states: States = {
        "texts": {
            state:    texts,
            setState: setTexts,
        },
        "writes": {
            state:    writes,
            setState: setWrites,
        },
        "deletes": {
            state:    deletes,
            setState: setDeletes,
        },
    };

    // set theme based on setting

    const [darkTheme, setDarkTheme] = useState(readBoolState("dark-theme"));

    useEffect(() => {
        darkTheme
            ? document.body.classList.add("dark-theme")
            : document.body.classList.remove("dark-theme")
    })

    // connection states

    const [isOffline, setIsOffline] = useState(readBoolState("isOffline"));
    const [isConnecting, setConnecting] = useState(false);

    const loadTexts = useCallback(async () => {
            setConnecting(true);
            try {
                const texts = await getRemoteTexts();
                saveState("texts", setTexts, texts);
                setOffline(false);
            } catch(err) {
                setErr(err);
                setOffline(true);
            }
            setConnecting(false);
    }, [])

    // load texts when queues are empty
    
    useEffect(() => {
        if (!isOffline && isEmpty(writes) && isEmpty(deletes)) {
            loadTexts();
        }
    }, [loadTexts, isOffline, writes, deletes]);

    // load texts when you open the app

    useEffect(() => {
        let wasFocus = true;

        const onFocusChange: (e: any) => void = e => {
            if (!isOffline && !document.hidden && !wasFocus) {
                loadTexts();
            }
            wasFocus = !document.hidden;
        };

        document.addEventListener("visibilitychange", onFocusChange);

        return () => {
            document.removeEventListener("visibilitychange", onFocusChange);
        }
    }, [loadTexts, isOffline]);


    // dark theme

    function switchTheme() {
        setDarkTheme(!darkTheme);
        storeBoolState("dark-theme", !darkTheme);
    }

    // isOffline state

    function setOffline(state: boolean) {
        setIsOffline(state);
        storeBoolState("isOffline", state);
    }

    async function switchConnection() {
        if (isOffline) {
            setConnecting(true);
            try {
                await emptyQueues();
                loadTexts();
            } catch(err) {
                setErr(err);
            }
            setConnecting(false);
            return;
        }
        setOffline(true);
    }

    // write and delete actions

    async function saveText(t: Text) {
        setEntry("texts", t)
        setEntry("writes", t)

        if (isOffline) return;

        try {
            await saveRemote(t);
            removeEntry("writes", t);
        } catch(err) {
            setErr(err);
            setOffline(true);
        }
    }

    async function deleteText(t: Text) {
        removeEntry("texts", t);
        removeEntry("writes", t);
        setEntry("deletes", t);

        if (isOffline) return;

        try {
            deleteRemote(t);
            removeEntry("deletes", t);
        } catch(err) {
            setErr(err);
            setOffline(true);
        }
    }

    function revertDelete(t: Text) {
        setEntry("texts", t)
        setEntry("writes", t)
        removeEntry("deletes", t)
    }

    function delWrite(t: Text) {
        removeEntry("writes", t)
    }

    // underlying saving functions

    function removeEntry(key: string, t: Text) {
        setList(key, trimList(states[key].state.slice(), t))
    }

    function setEntry(key: string, t: Text) {
        setList(key, updateList(states[key].state.slice(), t))
    }

    function setList(key: string, list: Text[]) {
        states[key].setState(list);
        storeState(key, list);
    }

    function saveState(key: string, setState: (list: Text[]) => void, list: Text[]) {
        setState(list);
        storeState(key, list);
    }

    // delete and write queues have to be empty before load

    function emptyQueues(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                await emptyQueue("writes", writes, setWrites);
                await emptyQueue("deletes", deletes, setDeletes);
            } catch(err) {
                reject(err);
            }
            resolve();
        })
    }

    function isEmpty(list: Text[]): boolean {
        if (!list) return true
        return list.length === 0
    }

    const conStates = {
        isOffline:    isOffline,
        isConnecting: isConnecting,
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
            <Top conStates={conStates} switchFuncs={switchFuncs} err={err} />
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

function emptyQueue(key: string, queue: Text[], setState: (list: Text[]) => void): Promise<string> {
    return new Promise(async (resolve, reject) => {
        for (const t of queue) {
            try {
                await savingFunc(key)(t);
                queue = trimList(queue, t);
                setState(queue.slice());
                storeState(key, queue);
            } catch(err) {
                reject(err);
            }
        }
        resolve();
    });
}

// corresponding functions to a key are returned
function savingFunc(key: string): (t: Text) => Promise<Response> {
    if (key === "writes") {
        return saveRemote;
    }
    if (key === "deletes") {
        return deleteRemote;
    }
    throw new Error("Could not find saving func. Key was: " + key + ".");
}
