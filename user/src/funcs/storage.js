const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
const offlineKey = "write_isOffline";

export const saveTextsState = texts => {
  return saveLocalStorage(textsKey, texts)
}

export const saveWritesState = writes => {
  return saveLocalStorage(writesKey, writes)
}

export const saveDeletesState = deletes => {
  return saveLocalStorage(deletesKey, deletes)
}

export const readTextsState = () => {
  return readLocalStorage(textsKey)
}

export const readWritesState = () => {
  return readLocalStorage(writesKey)
}

export const readDeletesState = () => {
  return readLocalStorage(deletesKey)
}

export const saveLocalStorage = (key, list) => {
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

