import Text from './text';

const timeoutMs = 1500;

export type reqStatus = {
    path: string;
    func: string;
    code: number;
    msg:  string;
}

type setErrFn = (err: reqStatus) => void;

function request(path: string, options: RequestInit, fnName: string): Promise<Response> {
    return new Promise(async (resolve, reject) => {

        let status: reqStatus = {
            func: fnName,
            path: path,
            code: 0,
            msg:  ""
        }

        let controller = new AbortController();
        let reqTimeout = setTimeout(function() {
            controller.abort();
            status.code = 408;
            status.msg = "request timed out";
            reject(status);
        }, timeoutMs)

        options.signal = controller.signal;

        try {
            const resp = await fetch(path, options);
            clearTimeout(reqTimeout);

            status.code = resp.status;

            if (!resp.ok) {
                switch (resp.status) {
                    case 403:
                        status.msg = "not logged in";
                        break;
                    case 502:
                        status.msg = "server not running";
                        break;
                    default:
                        status.msg = await resp.text();
                }

                reject(status);
                return;
            }
            resolve(resp);

        } catch(err) {
            // TODO: improve error handling
            if (err instanceof Error) {
                if (err.name === "AbortError") {
                    // this error was handled via reqTimeout.
                    return;
                }
            }
            throw err;
        }
    });
}

export async function getRemoteTexts(): Promise<Text[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await request("/api/texts/", {} as RequestInit, "getTexts");
            const texts = await resp.json();
            resolve(texts);
        } catch(err) {
            // custom error object
            /*
                if (err.func !== "") {
                    reject(err)
                }
             */
            // TODO: improve error handling
            if (err instanceof Error) {
                reject(err)
            }
            // json parse error
            throw err;
        }
    });
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

export function newOkStatus(): reqStatus {
    return {
        func: "",
        code: 200,
        path: "",
        msg:  ""
    }
}


