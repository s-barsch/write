import React from 'react';
import { makeKey } from "../../funcs/date";
import { useParams } from "react-router-dom";
import { Text } from "../text";
import Error from '../error';
import { SectionProps } from '../../helper';

type ParamTypes = {
  name: string
}

function Single({texts, modFuncs}: SectionProps) {
    const { name } = useParams<ParamTypes>();

    const id = name.substr(0, name.lastIndexOf("."))
    const text = texts.find((t) => t.id === id);

    if (!text) {
        return (
            <Error message={
                <>
                Text <samp>{name}</samp> not found.
                </>
            } />
        )
    }

    return (
        <Text key={makeKey(text.id)} isSingle={true} isNew={false} text={text}
        saveFn={modFuncs.saveText} delFn={modFuncs.deleteText} />
    )
}

export default Single;
