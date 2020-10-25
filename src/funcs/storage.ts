import Text from './text';

export function readState(key: string): Text[] {
    const list = localStorage.getItem(key);
    if (list == null || list === "{}") {
        return [];
    }
    let texts: Text[] = [];
    try {
        texts = JSON.parse(list);
    } catch(err) {
        throw err;
    }
    return texts;
}

export function storeState(key: string, list: Text[]) {
    localStorage.setItem(key, JSON.stringify(list));
}

export function storeBoolState(key: string, state: boolean) {
    localStorage.setItem(key, String(state));
}

export function readBoolState(key: string): boolean {
    const state = localStorage.getItem(key);
    if (state == null) {
        return false;
    }
    return state === "true";
}

