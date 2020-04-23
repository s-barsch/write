const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
const offlineKey = "write_isOffline";

export const hasEntry = (list, t) => {
  list.forEach(el => {
    if (el.id === t.id) {
      return true;
    }
  });
  return false;
}

export const updateList = (list, t) => {
  let is = false;
  list.forEach(el => {
    if (el.id === t.id) {
      el = t
      is = true;
    }
  });
  if (!is) {
    list= [t].concat(list);
  }
  return list;
}

export const deleteEntry = (list, t) => {
  return list.filter(el => { return el.id !== t.id });
}

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

