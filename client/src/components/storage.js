const textsKey = "write_texts";
const queueKey = "write_queue";

export const deleteRemote = (queue, t) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8231/api/text/" + t.id + ".txt", {
      method: "DELETE",
    })
    queue = deleteEntry(queue, t);
    writeQueue(queue);
    resolve(queue);
  })
}

export const saveRemote = (queue, t) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8231/api/text/" + t.id + ".txt", {
      method: "PUT",
      body: t.body
    })
    queue = deleteEntry(queue, t);
    writeQueue(queue);
    resolve(queue);
  })
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

export const writeQueue = queue => {
  localStorage.setItem(queueKey, JSON.stringify(queue));
}


export const readQueue = () => {
  const locals = localStorage.getItem(queueKey);
  if (locals == null) {
    return [];
  }
  return JSON.parse(locals);
}
