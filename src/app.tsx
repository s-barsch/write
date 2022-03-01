import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';
import './main.scss';
import Top from './comps/top/top';
import NewText from './comps/sections/new';
import Texts from './comps/sections/texts';
import Single from './comps/sections/single';
import Queue from './comps/sections/queue';
import { updateList, trimList } from './funcs/list';
import { getRemoteTexts, deleteRemote, saveRemote, newOkStatus, reqStatus } from './funcs/remote';
import { readState, storeState, readBoolState, storeBoolState } from './funcs/storage';
import Text, { demoText } from './funcs/text';

type States = {
    [key: string]: StateObject;
}

type StateObject = {
    state: Text[];
    setState: (texts: Text[]) => void;
}

export default function Write() {

    const [status, setStatus] = useState({code: 0} as reqStatus);

    // `texts` are the displayed texts. `writes` and `deletes` are queues.

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

    const wasFocus = useRef(true);

    useEffect(() => {
        async function loadTexts() { 
            setConnecting(true);
            try {
                const texts = await getRemoteTexts();
                saveState("texts", setTexts, texts);
                setOffline(false);
                flashRequest();
            } catch(err) {
                // TODO: improve error handling
                if (err instanceof Error) {
                    setStatus({msg: err.message} as reqStatus)
                }
                setOffline(true);
                //setStatus(err);
            }
            setConnecting(false);
        }

        // only load when online.

        if (!isOffline) {
            loadTexts();
        }

        // reload texts after tab switch or app close to sync devices.

        const onFocusChange: (e: Event) => void = e => {
            if (!isOffline && !document.hidden && !wasFocus.current) {
                loadTexts();
            }
            wasFocus.current = !document.hidden;
        };

        document.addEventListener("visibilitychange", onFocusChange);

        return () => {
            document.removeEventListener("visibilitychange", onFocusChange);
        }
    }, [isOffline]);

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
                const texts = await getRemoteTexts();
                flashRequest();
                setList("texts", texts);
                setOffline(false);
            } catch(err) {
                // TODO: improve error handling
                if (err instanceof Error) {
                    setStatus({msg: err.message} as reqStatus)
                }
                //setStatus(err);
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
            flashRequest();
            removeEntry("writes", t);
        } catch(err) {
            // TODO: improve error handling
            if (err instanceof Error) {
                setStatus({msg: err.message} as reqStatus)
            }
            //setStatus(err);
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
            flashRequest();
            removeEntry("deletes", t);
        } catch(err) {
            // TODO: improve error handling
            if (err instanceof Error) {
                setStatus({msg: err.message} as reqStatus)
            }
            //setStatus(err);
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
                flashRequest();
                await emptyQueue("deletes", deletes, setDeletes);
                flashRequest();
            } catch(err) {
                reject(err);
            }
            resolve("");
        })
    }

    //

    function flashRequest() {
        setStatus(newOkStatus());
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
            saveState("texts", setTexts, demo);
            saveState("writes", setWrites, demo);
        }
    }, [texts]);


    return (
        <Router>
            <Top conStates={conStates} switchFuncs={switchFuncs} status={status} />
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
        resolve("");
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

        /*
    function isEmpty(list: Text[]): boolean {
        if (!list) return true
        return list.length === 0
    }
         */


