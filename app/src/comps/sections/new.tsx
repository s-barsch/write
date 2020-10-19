import React, { useState, useEffect } from 'react';
import { Text } from "../text";
import { makeKey } from "../../funcs/date";
import emptyText, { File} from "../../funcs/file";
import { useHistory } from "react-router-dom";
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

    const history = useHistory();

    function save(f: File) {
        modFuncs.saveText(f);
        history.push("/texts/" + f.id + ".txt")
    }

    return (
        <Text key={makeKey(newText.id)} text={newText} saveFn={save} delFn={() => void(0)} isSingle={true} isNew={true} />
    )
}

export default NewText;
