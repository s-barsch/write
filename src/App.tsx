import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import './main.scss';
import Top from './components/top/top';
import NewText from './components/sections/new';
import Texts from './components/sections/texts';
import Single from './components/sections/single';
import Queue from './components/sections/queue';
import { updateList, trimList } from './funcs/list';
import { getRemoteTexts, deleteRemote, saveRemote, reqStatus, setStatusFn } from './funcs/remote';
import { readState, storeState, readBoolState, storeBoolState } from './funcs/storage';
import Text, { demoText } from './funcs/text';

export default function Write() {

    const [status, setStatus] = useState({code: 0} as reqStatus);

    // `texts` are the displayed texts. `writes` and `deletes` are queues.

    const [texts, setTexts] = useState(readState("texts"));
    const [writes, setWrites] = useState(readState("writes"));
    const [deletes, setDeletes] = useState(readState("deletes"));

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
        // only load when online.

        if (!isOffline) {
            loadTexts();
        }

        async function loadTexts() {
            setConnecting(true);
            try {
                const newTexts = await getRemoteTexts(setStatus);
                setList("texts", newTexts);
                setOffline(false);
            } catch (err) {
                setOffline(true);
            }
            setConnecting(false);
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
                const texts = await getRemoteTexts(setStatus);
                setList("texts", texts);
                setOffline(false);
            } finally {
                setConnecting(false);
                return;
            }
        }
        setOffline(true);
    }

    // write and delete actions

    async function saveText(t: Text) {
        setEntry("texts", t)
        setEntry("writes", t)

        if (isOffline) return;

        try {
            await saveRemote(t, setStatus);
            removeEntry("writes", t);
        } finally {
            setOffline(true);
        }
    }

    async function deleteText(t: Text) {
        removeEntry("texts", t);
        removeEntry("writes", t);
        setEntry("deletes", t);

        if (isOffline) return;

        try {
            await deleteRemote(t, setStatus);
            removeEntry("deletes", t);
        } catch(err) {
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

    const states: {[key: string]: Text[]}= {
        "texts": texts,
        "writes": writes,
        "deletes": deletes
    };

    function removeEntry(key: string, t: Text) {
        setList(key, trimList(states[key].slice(), t))
    }

    function setEntry(key: string, t: Text) {
        setList(key, updateList(states[key].slice(), t))
    }

    function setList(key: string, list: Text[]) {
        const setFns: {[key: string]: (texts: Text[]) => void}= {
            "texts": setTexts,
            "writes": setWrites,
            "deletes": setDeletes
        };

        setFns[key](list);
        storeState(key, list);
    }

    // delete and write queues have to be empty before load

    function emptyQueues(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let queues = ["writes", "deletes"]
            for (const queue of queues) {
                try {
                    await emptyQueue(queue);
                } catch(err) {
                    reject(err)
                }
            }
            resolve("");
        })
    }

    function emptyQueue(key: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            for (const t of states[key]) {
                try {
                    await saveFn(key)(t, setStatus);
                    states[key] = trimList(states[key], t);
                    setList(key, states[key].slice())
                } catch (err) {
                    reject(err);
                }
            }
            resolve("");
        });
    }

    // corresponding functions to a key are returned
    function saveFn(key: string): (t: Text, setStatus: setStatusFn) => Promise<Response> {
        switch (key) {
            case "writes":
                return saveRemote;
            case "deletes":
                return deleteRemote;
            default:
                throw new Error("Could not find saving func. Key was: " + key + ".");
        }
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
            setList("texts", demo);
            setList("writes", demo);
        }
    }, [texts]);


    return (
        <Router>
            <Top conStates={conStates} switchFuncs={switchFuncs} status={status} />
            <Routes>
                <Route path="/" element={<NewText modFuncs={modFuncs} />} />
                <Route path="/texts/:name" element={<Single texts={texts} modFuncs={modFuncs} />} />
                <Route path="/texts/" element={<Texts texts={texts} modFuncs={modFuncs} />} />
                <Route path="/queue/" element={<Queue writes={writes} deletes={deletes} modFuncs={modFuncs} />} />
            </Routes>
        </Router>
    );
}
