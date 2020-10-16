/*
const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
const offlineKey = "write_isOffline";
*/

export const readState = (key) => {
  const list = localStorage.getItem(key);
  if (list == null) {
    return [];
  }
  return JSON.parse(list);
}

export const storeState = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
}

export const storeBoolState = (key, str) => {
  localStorage.setItem(key, str);
}

export const readBoolState = key => {
  const str = localStorage.getItem(key);
  if (str == null) {
    return false;
  }
  return str === "true";
}

