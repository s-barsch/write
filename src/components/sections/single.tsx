import React from 'react';
import { makeKey } from '../../funcs/date';
import { useParams } from 'react-router-dom';
import { TextField } from '../text';
import Error from '../error';
import { SectionProps } from '../../helper';
import useWriteStore from 'stores/states';

type ParamTypes = {
  name: string
}

function Single() {
    const { name } = useParams<ParamTypes>();
    const { states, saveText, deleteText } = useWriteStore()
    let texts = states["texts"]

    if (name === undefined) {
        return <>{'/texts/:name undefined'}</>
    }

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
        <TextField key={makeKey(text.id)} isSingle={true} isNew={false} text={text}
        saveFn={saveText} delFn={deleteText} />
    )
}

export default Single;
