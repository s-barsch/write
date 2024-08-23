import React, { useState, useEffect } from 'react';
import { TextField } from '../text';
import { makeKey } from '../../funcs/date';
import Text, { emptyText } from '../../funcs/text';
import { ModFuncs } from '../../helper';
import useWriteStore from 'stores/states';

type NewTextProps = {
    modFuncs: ModFuncs;
}

function NewText() {
    const [newText, setNewText] = useState(emptyText());
    const { saveText } = useWriteStore();

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
        saveText(t);
        setNewText(emptyText());
    }

    return (
        <TextField key={makeKey(newText.id)} text={newText} saveFn={save} delFn={() => void(0)} isSingle={true} isNew={true} />
    )
}

export default NewText;
