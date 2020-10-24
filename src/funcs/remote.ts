import Text from './text';

const timeoutMs = 1500;

export type reqErr = {
    path: string;
    func: string;
    code: number;
    msg:  string;
}

type setErrFn = (err: reqErr) => void;

function request(path: string, method: string, body: string, err: reqErr): Promise<Response> {
    return new Promise(async (resolve, reject) => {

        err.path = path;

        let controller = new AbortController();
        let reqTimeout = setTimeout(function() {
            controller.abort();
            err.code = 408;
            err.msg = "request timed out";
            reject(err);
        }, timeoutMs)

        const options = {
            method: "GET",
            signal: controller.signal
        } as RequestInit;

        if (method !== "GET") {
            options.method = method;
            options.body = body;
        }

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

function newErr(funcName: string): reqErr {
    return {
        func: funcName,
        path: "",
        code: 0,
        msg:  ""
    }
}

export async function getRemoteTexts(): Promise<Text[]> {
    const resp = await request("/api/texts/", "GET", "", newErr("getTexts"));
    return await resp.json();
}

export function saveRemote(t: Text): Promise<Response> {
    return request("/api/text/" + t.id + ".txt", "PUT", t.body, newErr("saveRemote"));
}

export function deleteRemote(t: Text): Promise<Response> {
    return request("/api/text/" + t.id + ".txt", "DELETE", "", newErr("deleteRemote"));
}


