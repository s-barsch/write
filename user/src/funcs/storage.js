/*
const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
*/
const offlineKey = "write_isOffline";

export const readState = (key) => {
  const list = localStorage.getItem("write_" + key);
  if (list == null) {
    return [];
  }
  return JSON.parse(list);
}

export const saveState = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
}

export const readLocalStorage = key => {
  const list = localStorage.getItem(key);
  if (list == null) {
    return [];
  }
  return JSON.parse(list);
}

export const saveOfflineState = str => {
  localStorage.setItem(offlineKey, str);
}

export const readOfflineState = () => {
  const str = localStorage.getItem(offlineKey);
  if (str == null) {
    return false;
  }
  return str === "true";
}

