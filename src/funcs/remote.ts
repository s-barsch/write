import Text from './text';

const timeoutMs = 1500;

export type reqErr = {
    path: string;
    func: string;
    code: number;
    msg:  string;
}

type setErrFn = (err: reqErr) => void;

function request(path: string, options: RequestInit, fnName: string): Promise<Response> {
    return new Promise(async (resolve, reject) => {

        let err: reqErr = {
            func: fnName,
            path: path,
            code: 0,
            msg:  ""
        }

        let controller = new AbortController();
        let reqTimeout = setTimeout(function() {
            controller.abort();
            err.code = 408;
            err.msg = "request timed out";
            reject(err);
        }, timeoutMs)

        options.signal = controller.signal;

        try {
            const resp = await fetch(path, options);
            clearTimeout(reqTimeout);

            if (!resp.ok) {
                err.code = resp.status;

                switch (resp.status) {
                    case 403:
                        err.msg = "not logged in";
                        break;
                    case 502:
                        err.msg = "server not running";
                        break;
                    default:
                        err.msg = await resp.text();
                }

                reject(err);
                return;
            }
            resolve(resp);

        } catch(fetchErr) {
            if (fetchErr.name === "AbortError") {
                // this error was handled via reqTimeout.
                return;
            }
            throw fetchErr;
        }
    });
}

export async function getRemoteTexts(): Promise<Text[]> {
    const resp = await request("/api/texts/", {} as RequestInit, "getTexts");
    return await resp.json();
}

export function saveRemote(t: Text): Promise<Response> {
    const options = {
        method: "PUT",
        body: t.body
    } as RequestInit;
    return request("/api/text/" + t.id + ".txt", options, "saveRemote");
}

export function deleteRemote(t: Text): Promise<Response> {
    const options = {
        method: "DELETE"
    } as RequestInit;
    return request("/api/text/" + t.id + ".txt", options, "deleteRemote");
}


