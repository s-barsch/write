import React, { useEffect, useState } from 'react';
import { reqStatus } from 'funcs/remote';

type StatusProps = {
    status: reqStatus;
    children: React.ReactNode;
}

export function Status({status, children}: StatusProps) {
    const [code, setCode] = useState(status.code);

    useEffect(() => {
        setCode(status.code);

        let timer: NodeJS.Timeout;

        switch(status.code) {
            case 200:
                timer = nilStatus(300);
                break;
            case 408:
            case 502:
                timer = nilStatus(3000);
                break;
            default:
        }

        return () => {
            clearTimeout(timer);
        }
    }, [status]);

    function nilStatus(timeMs: number): NodeJS.Timeout {
        return setTimeout(() => {
            setCode(0)
        }, timeMs);
    }

    switch (code) {
        case 0:
            return <>{children}</>;
        case 200:
            return <span className="success">{children}</span>
        default:
            return (
                <span className="fail">
                    <span className="status">{status.msg}</span>{children}
                </span>
            )
    }
}
        


