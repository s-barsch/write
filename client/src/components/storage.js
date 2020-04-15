const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";

export const deleteRemote = (writes, t) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8231/api/text/" + t.id + ".txt", {
      method: "DELETE",
    })
    writes = deleteEntry(writes, t);
    saveWrites(writes);
    resolve(writes);
  })
}

export const saveRemote = (writes, t) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8231/api/text/" + t.id + ".txt", {
      method: "PUT",
      body: t.body
    })
    writes = deleteEntry(writes, t);
    saveWrites(writes);
    resolve(writes);
  })
}

export const hasEntry = (list, t) => {
  list.forEach(el => {
    if (el.id === t.id) {
      return true;
    }
  });
  return false;
}

export const saveEntry = (list, t) => {
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

export const saveWrites = writes => {
  return saveLocalStorage(writesKey, writes)
}

export const saveDeletes = deletes => {
  return saveLocalStorage(deletesKey, deletes)
}

export const readWrites = () => {
  return readLocalStorage(writesKey)
}

export const readDeletes = () => {
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
