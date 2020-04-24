export const server = "http://192.168.1.7:8231"

export const getRemoteTexts = () => {
  const ms = 1500;
  const abortController = new AbortController();
  return new Promise((resolve, reject) => {
    let run = setTimeout(function() {
      abortController.abort();
      reject("Request terminated after " + ms + "ms.");
    }, ms)

    fetch(server + "/api/texts/", {
      signal: abortController.signal,
    }).then(
      resp => {
        clearTimeout(run);
        if (resp.ok) {
          resp.json().then(
            texts => resolve(texts),
            err => reject(err)
          )
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

const makeFetch = (fetchPromise, abortController) => {
  const ms = 1500;
  return new Promise((resolve, reject) => {
    let run = setTimeout(function() {
      abortController.abort();
      reject("Request terminated after " + ms + "ms.");
    }, ms)

    fetchPromise.then(
      resp => {
        clearTimeout(run);
        if (resp.ok) {
          resolve();
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

export const saveRemote = t => {
  let controller = new AbortController();
  return makeFetch(
    fetch(server + "/api/text/" + t.id + ".txt", {
      method: "PUT",
      signal: controller.signal,
      body: t.body
    }),
    controller,
  );
}

export const deleteRemote = t => {
  let controller = new AbortController();
  return makeFetch(
    fetch(server + "/api/text/" + t.id + ".txt", {
      method: "DELETE",
      signal: controller.signal
    }),
    controller,
  );
}


