
export function readState(key: string): File[] {
  const list = localStorage.getItem(key);
  if (list == null) {
    return [];
  }
  return JSON.parse(list);
}

export function storeState(key: string, list: File[]) {
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

