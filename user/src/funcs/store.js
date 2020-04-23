const textsKey = "write_texts";
const writesKey = "write_writes";
const deletesKey = "write_deletes";
const offlineKey = "write_isOffline";

export const server = "http://192.168.1.7:8231"

const makeFetch = (fetchPromise, returnList, controller) => {
  const ms = 1500;
  return new Promise((resolve, reject) => {
    let run = setTimeout(function() {
      controller.abort();
      reject("Request terminated after " + ms + "ms.");
    }, ms)

    fetchPromise.then(
      resp => {
        clearTimeout(run);
        if (resp.ok) {
          resolve(returnList);
        } else {
          resp.text().then(text => reject(text));
        }
      }
    )
    .catch(err => {
      console.log(err);
      //reject(err)
    });
  });
}

export const saveRemote = (writes, t) => {
  let controller = new AbortController();
  return makeFetch(
    fetch(server + "/api/text/" + t.id + ".txt", {
      method: "PUT",
      signal: controller.signal,
      body: t.body
    }),
    deleteEntry(writes, t),
    controller,
  );
}

export const deleteRemote = (deletes, t) => {
  let controller = new AbortController();
  return makeFetch(
    fetch(server + "/api/text/" + t.id + ".txt", {
      method: "DELETE",
      signal: controller.signal
    }),
    deleteEntry(deletes, t),
    controller,
  );
}

export const hasEntry = (list, t) => {
  list.forEach(el => {
    if (el.id === t.id) {
      return true;
    }
  });
  return false;
}

export const putEntry = (list, t) => {
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

export const saveTexts = texts => {
  return saveLocalStorage(textsKey, texts)
}

export const saveWrites = writes => {
  return saveLocalStorage(writesKey, writes)
}

export const saveDeletes = deletes => {
  return saveLocalStorage(deletesKey, deletes)
}

export const readTexts = () => {
  return readLocalStorage(textsKey)
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

export const storeOfflineState = str => {
  localStorage.setItem(offlineKey, str);
}

export const readOfflineState = () => {
  const str = localStorage.getItem(offlineKey);
  if (str == null) {
    return false;
  }
  return str === "true";
}

