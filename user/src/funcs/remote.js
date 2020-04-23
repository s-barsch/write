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


