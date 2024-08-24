import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import './main.scss';
import Top from './components/top/top';
import NewText from './components/sections/new';
import Texts from './components/sections/texts';
import Single from './components/sections/single';
import Queue from './components/sections/queue';
import { getRemoteTexts } from './funcs/remote';
import useThemeStore, { setThemeStyling } from './stores/theme';
import useConnectionStore from './stores/connection';
import useWriteStore from './stores/states';
import PWABadge from './PWABadge.tsx';

export default function Write() {
    const { isDarkTheme } = useThemeStore();
    useEffect(() => {
        setThemeStyling(isDarkTheme)
    }, [isDarkTheme]);

    const { isOffline, setOffline, setConnecting } = useConnectionStore();
    const { setStates, setStatus } = useWriteStore()

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
                setStates("texts", newTexts);
                setOffline(false);
            } catch (err) {
                setOffline(true);
            }
            setConnecting(false);
        }

        // reload texts after tab switch or app close to sync devices.

        const onFocusChange: (e: Event) => void = _e => {
            if (!isOffline && !document.hidden && !wasFocus.current) {
                loadTexts();
            }
            wasFocus.current = !document.hidden;
        };

        document.addEventListener("visibilitychange", onFocusChange);

        return () => {
            document.removeEventListener("visibilitychange", onFocusChange);
        }
    }, [isOffline, setConnecting, setOffline, setStates, setStatus]);

    return (
        <Router>
            <PWABadge />
            <Top />
            <Routes>
                <Route path="/" element={<NewText />} />
                <Route path="/texts/:name" element={<Single />} />
                <Route path="/texts/" element={<Texts />} />
                <Route path="/queue/" element={<Queue />} />
            </Routes>
        </Router>
    );
}

/*
    useEffect(() => {
        if (texts.length === 0 && process.env.REACT_APP_IS_DEMO === "true") {
            const demo = [demoText()]
            setList("texts", demo);
            setList("writes", demo);
        }
    }, [texts]);
*/