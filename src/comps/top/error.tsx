import React, { useEffect, useState } from 'react';
import { reqErr } from 'funcs/remote';

function StatusBox() {
    return <span className="errbox"></span>
}

export function ErrComponent({err}: {err: reqErr}) {
    const [status, setStatus] = useState(err.code);

    useEffect(() => {
        setStatus(err.code);
    }, [err]);

    if (err.code === 200) {
        setTimeout(() => {
            setStatus(0);
        }, 750);
    }

    switch (status) {
        case 0:
            return null
        case 200:
            return <span className="success"><StatusBox /></span>
        default:
            return (
                <span className="fail">
                    <span className="err">{err.msg}</span><StatusBox/>
                </span>
            )
    }
}
