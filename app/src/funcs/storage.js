/*
const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
const offlineKey = "write_isOffline";
*/

export const readState = (key) => {
  const list = localStorage.getItem("write_" + key);
  if (list == null) {
    return [];
  }
  return JSON.parse(list);
}

export const saveState = (key, list) => {
  localStorage.setItem("write_" + key, JSON.stringify(list));
}

export const saveBoolState = (key, str) => {
  localStorage.setItem("write_" + key, str);
}

export const readBoolState = key => {
  const str = localStorage.getItem("write_" + key);
  if (str == null) {
    return false;
  }
  return str === "true";
}

