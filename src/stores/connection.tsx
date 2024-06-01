import { readBoolState, storeBoolState } from 'funcs/storage';
import { create } from 'zustand'

interface ConnectionStore {
    isOffline: boolean;
    isConnecting: boolean;
    setConnecting: (state: boolean) => void;
    setOffline: (state: boolean) => void;
}

let useConnectionStore = create<ConnectionStore>()( 
    (set, get) => ({
        isOffline: readBoolState("isOffline"),
        isConnecting: false,
        setOffline: (state: boolean) => {
            set({ isOffline: state })
            storeBoolState("isOffline", state);
        },
        setConnecting: (state: boolean) => {
            set({ isConnecting: state })
        }
    })
)

export default useConnectionStore;