import Text from './text';

export function getRemoteTexts(): Promise<Text[]> {
    const ms = 1500;
    const abortController = new AbortController();
    return new Promise((resolve, reject) => {
        let run = setTimeout(function() {
            abortController.abort();
            reject("Request terminated after " + ms + "ms.");
        }, ms)

        fetch("/api/texts/", {
            signal: abortController.signal,
        }).then(
            resp => {
                clearTimeout(run);
                if (resp.ok) {
                    resp.json().then(
                        (texts: Text[]) => resolve(texts),
                        err => reject(err)
                    )
                } else {
                    resp.text().then((text: string) => reject(text));
                }
            }
        )
            .catch(err => {
                console.log(err);
                reject(err)
            });
    });
}

function makeFetch(fetchPromise: Promise<any>, abortController: AbortController): Promise<any> {
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
                    resp.text().then((text: string) => reject(text));
                }
            }
        )
            .catch(err => {
                console.log(err);
                //reject(err)
            });
    });
}

export function saveRemote(t: Text) {
    let controller = new AbortController();
    return makeFetch(
        fetch("/api/text/" + t.id + ".txt", {
            method: "PUT",
            signal: controller.signal,
            body: t.body
        }),
        controller,
    );
}

export function deleteRemote(t: Text) {
    let controller = new AbortController();
    return makeFetch(
        fetch("/api/text/" + t.id + ".txt", {
            method: "DELETE",
            signal: controller.signal
        }),
        controller,
    );
}


