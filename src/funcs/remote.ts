import Text from './text';

const timeoutMs = 1500;

export type reqStatus = {
    path: string;
    func: string;
    code: number;
    msg:  string;
}

export type setStatusFn = (reqStatus: reqStatus) => void;

//type setErrFn = (err: reqStatus) => void;

function request(path: string, options: RequestInit, fnName: string, setStatus: setStatusFn): Promise<Response> {
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

                if (setStatus !== undefined) {
                    setStatus(status);
                }
                reject(status);
            }
            setStatus(status);
            resolve(resp);

        } catch(err) {
            status.code = 900;
            status.msg = "could not connect to server"
            if (setStatus !== undefined) {
                setStatus(status);
            }
            reject(status);
        }
    });
}

export async function getRemoteTexts(setStatus: setStatusFn): Promise<Text[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await request("/api/texts/", {} as RequestInit, "getTexts", setStatus);
            const texts = await resp.json();
            resolve(texts);
        } catch(err) {
            reject(err);
        }
    });
}

export function saveRemote(t: Text, setStatus: setStatusFn): Promise<Response> {
    const options = {
        method: "PUT",
        body: t.body
    } as RequestInit;
    return request("/api/text/" + t.id + ".txt", options, "saveRemote", setStatus);
}

export function deleteRemote(t: Text, setStatus: setStatusFn): Promise<Response> {
    const options = {
        method: "DELETE"
    } as RequestInit;
    return request("/api/text/" + t.id + ".txt", options, "deleteRemote", setStatus);
}

export function newOkStatus(): reqStatus {
    return {
        func: "",
        code: 200,
        path: "",
        msg:  ""
    }
}


