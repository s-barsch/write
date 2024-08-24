import { create } from 'zustand'
import { WriteStates, readWriteStates, storeWriteStates } from '../funcs/storage'
import Text from '../funcs/text'
import { trimList, updateList } from '../funcs/list'
import { deleteRemote, getRemoteTexts, reqStatus, saveRemote, setStatusFn } from '../funcs/remote';
import useConnectionStore from './connection';

interface WriteStore {
    states: WriteStates;
    status: reqStatus;
    setStatus: (reqStatus: reqStatus) => void;
    readState: () => void;
    setStates: (key: string, list: Text[]) => void;
    setEntry: (key: string, t: Text) => void;
    removeEntry: (key: string, t: Text) => void;
    saveText: (t: Text) => void;
    deleteText: (t: Text) => void;
    revertDelete: (t: Text) => void;
    delWrite: (t: Text) => void;
    emptyQueue: (key: string) => Promise<string>;
    emptyQueues: () => Promise<string>;
    saveFn: (key: string) => (t: Text, setStatus: setStatusFn) => Promise<Response>;
    syncTexts: () => void;
}

const useWriteStore = create<WriteStore>()(
      (set, get) => ({
        states: readWriteStates(),
        status: { code: 0 } as reqStatus,
        setStatus: (reqStatus: reqStatus) => {
            set({status: reqStatus})
        },
        readState: () => {
          set({states: readWriteStates()});
        },
        setStates: (key, list) => {
            let newStates = get().states;
            newStates[key] = list;
            set({ states: newStates })
            storeWriteStates(newStates)
        },
        setEntry: (key, t) => {
            get().setStates(key, updateList(get().states[key].slice(), t))
        },
        removeEntry: (key, t) => {
            get().setStates(key, trimList(get().states[key].slice(), t))
        },
        saveText: async (t) => {
            get().setEntry("texts", t)
            get().setEntry("writes", t)

            if (useConnectionStore.getState().isOffline) return;

            try {
                await saveRemote(t, get().setStatus);
                get().removeEntry("writes", t);
            } catch(err) {
                useConnectionStore.getState().setOffline(true);
            }
        },
        deleteText: async (t) => {
            get().removeEntry("texts", t);
            get().removeEntry("writes", t);
            get().setEntry("deletes", t);

            if (useConnectionStore.getState().isOffline) return;

            try {
                await deleteRemote(t, get().setStatus);
                get().removeEntry("deletes", t);
            } catch(err) {
                useConnectionStore.getState().setOffline(true);
            }
        },
        revertDelete: (t) => {
            get().setEntry("texts", t)
            get().setEntry("writes", t)
            get().removeEntry("deletes", t)
        },
        delWrite: (t) => {
            get().removeEntry("writes", t)
        },
        // corresponding functions to a key are returned
        saveFn: (key: string): (t: Text, setStatus: setStatusFn) => Promise<Response> => {
            switch (key) {
                case "writes":
                    return saveRemote;
                case "deletes":
                    return deleteRemote;
                default:
                    throw new Error("Could not find saving func. Key was: " + key + ".");
            }
        },
        // delete and write queues have to be empty before load
        emptyQueue: (key: string): Promise<string> => {
            return new Promise(async (resolve, reject) => {
                for (const t of get().states[key]) {
                    try {
                        await get().saveFn(key)(t, get().setStatus);
                        get().states[key] = trimList(get().states[key], t);
                        get().setStates(key, get().states[key].slice())
                    } catch (err) {
                        reject(err);
                    }
                }
                resolve("");
            });
        },
        emptyQueues: () => {
            return new Promise(async (resolve, reject) => {
                let queues = ["writes", "deletes"]
                for (const queue of queues) {
                    try {
                        await get().emptyQueue(queue);
                    } catch(err) {
                        reject(err)
                    }
                }
                resolve("");
            })
        },
        syncTexts: async () => {
            const setConnecting = useConnectionStore.getState().setConnecting;
            const setOffline = useConnectionStore.getState().setOffline;
            if (useConnectionStore.getState().isOffline) {
                setConnecting(true);
                try {
                    await get().emptyQueues();
                    const texts = await getRemoteTexts(get().setStatus);
                    get().setStates("texts", texts);
                    setOffline(false);
                } finally {
                    setConnecting(false);
                    return;
                }
            }
            setOffline(true);
        }
    }),
)

export default useWriteStore;