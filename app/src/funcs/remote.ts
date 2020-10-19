import { File } from './file';

export function getRemoteTexts(): Promise<File[]> {
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
                        (texts: File[]) => resolve(texts),
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

export function saveRemote(f: File) {
    let controller = new AbortController();
    return makeFetch(
        fetch("/api/text/" + f.id + ".txt", {
            method: "PUT",
            signal: controller.signal,
            body: f.body
        }),
        controller,
    );
}

export function deleteRemote(f: File) {
    let controller = new AbortController();
    return makeFetch(
        fetch("/api/text/" + f.id + ".txt", {
            method: "DELETE",
            signal: controller.signal
        }),
        controller,
    );
}


