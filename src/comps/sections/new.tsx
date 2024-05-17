import React, { useState, useEffect } from 'react';
import { TextField } from '../text';
import { makeKey } from '../../funcs/date';
import Text, { emptyText } from '../../funcs/text';
import { ModFuncs } from '../../helper';

type NewTextProps = {
    modFuncs: ModFuncs;
}

function NewText({modFuncs}: NewTextProps) {
    const [newText, setNewText] = useState(emptyText());

    useEffect(() => {
        let wasFocus = true;

        const onFocusChange: (e: any) => void = e => {
            if (!wasFocus) {
                setNewText(emptyText());
            }
            wasFocus = !document.hidden;
        };

        document.addEventListener("visibilitychange", onFocusChange);

        return () => {
            document.removeEventListener("visibilitychange", onFocusChange);
        }
    }, []);

    function save(t: Text) {
        modFuncs.saveText(t);
        setNewText(emptyText());
    }

    return (
        <TextField key={makeKey(newText.id)} text={newText} saveFn={save} delFn={() => void(0)} isSingle={true} isNew={true} />
    )
}

export default NewText;
