import React, { useState, useEffect } from 'react';
import { Text } from "../text";
import { makeKey } from "../../funcs/date";
import emptyText from "../../funcs/file";
import { useHistory } from "react-router-dom";
import { ModFuncs } from '../../helper';

type NewTextProps = {
    modFuncs: ModFuncs;
}

function NewText({modFuncs}: NewTextProps) => {
    const [newText, setNewText] = useState(emptyText());

    useEffect(() => {
        let wasFocus = true;

        const onFocusChange = event => {
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

    const history = useHistory();

    const save = t => {
        modFuncs.saveText(t);
        history.push("/texts/" + t.id + ".txt")
    }

    return (
        <Text key={makeKey(newText.id)} text={newText} saveFn={save} isSingle={true} isNew={true} />
    )
}

export default NewText;
