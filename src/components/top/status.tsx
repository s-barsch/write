import React, { useEffect } from 'react';
import { reqStatus } from '../../funcs/remote';
import useWriteStore from '../../stores/states';

type StatusProps = {
    children: React.ReactNode;
}

export function Status({children}: StatusProps) {
    const { status, setStatus } = useWriteStore();

    useEffect(() => {
        let timer: NodeJS.Timeout;

        switch(status.code) {
            case 200:
                timer = nilStatus(300);
                break;
            case 408:
            case 900:
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
            setStatus({ code: 0 } as reqStatus);
        }, timeMs);
    }

    switch (status.code) {
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
        


