import React, { useState, useEffect, useRef } from 'react';
import { Link }  from 'react-router-dom';
//import TextareaAutosize from 'react-textarea-autosize';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { makeKey } from "../funcs/date";
import DeleteIcon from '@material-ui/icons/ClearSharp';
import Text from '../funcs/text';
import Error from './error';

type TextListProps = {
    texts:  Text[];
    saveFn: (f: Text) => void;
    delFn:  (f: Text) => void;
}

export function TextList({ texts, saveFn, delFn }: TextListProps) {
    if (!texts || texts.length === 0) {
        return (
            <Error message={<>No <samp>Texts</samp> found.</>} />
        )
    }
    return (
        <>{texts.map((text, i) => (
                <TextField key={makeKey(text.id)} text={text} saveFn={saveFn} delFn={delFn}
                isSingle={false} isNew={false} />
        ))}</>
    )
}

type SavedProps = {
    saved: number;
    mod: string;
}

function Saved({saved, mod}: SavedProps) {
    let className = "mod";
    if (saved === 1) {
        className += " unsaved"
    }
    if (saved === 2) {
        className += " saved"
    }
    return (
        <button className={className}>{mod}</button>
    )
}

type InfoProps = {
    text: Text;
    isSingle: boolean;
    isNew: boolean;
    saved: number; 
    delFn: (t: Text) => void;
}


export function Info({ text, isSingle, isNew, saved, delFn }: InfoProps) {
    return (
        <header className="info">
        <TextLink text={text} isSingle={isSingle} isNew={isNew} />
        <Saved saved={saved} mod={text.mod.toString(16).substr(-6)} />
        { delFn && <Del text={text} delFn={delFn} /> }
        </header>
    )
}

type TextProps = {
    text: Text;
    saveFn: (t: Text) => void;
    delFn: (t: Text) => void;
    isSingle: boolean;
    isNew: boolean;
}

export function TextField({ text, saveFn, delFn, isSingle, isNew }: TextProps) {
    const [body, setBody] = useState(text.body);
    const [saved, setSaved] = useState(0);

    useEffect(() => {
        setBody(text.body)
    }, [text.body]);

    const textRef = useRef<HTMLTextAreaElement>(null!);
    let blink = useRef({} as NodeJS.Timeout);

    useEffect(() => {
        if (isSingle && textRef && textRef.current) {
            textRef.current.focus({preventScroll:true});
        }

        if (!isNew && isSingle && text.firstEdit) {
            blink.current = blinkGreen();
            text.firstEdit = false;
        }

        return () => {
            setSaved(0);
            clearTimeout(blink.current);
        }

    }, [isSingle, isNew, text]);

    const handleTyping = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        setSaved(1);
        setBody(e.currentTarget.value);
    }

    const blinkGreen: () => NodeJS.Timeout = () => {
        setSaved(2);
        return setTimeout(() => {
            setSaved(0);
        }, 600);
    }


    const submit = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        if (body === "") {
            return
        }

        text.mod  = Date.now();
        text.body = body;
        saveFn(text);
        blink.current = blinkGreen();
    }

    let rows = !isSingle ? 1 : 8;

    return (
        <article className="text">
        <Info text={text} saved={saved} isSingle={isSingle} isNew={isNew} delFn={delFn} />
        <TextareaAutosize
        ref={textRef}
        minRows={rows}
        value={body}
        onChange={handleTyping}
        onBlur={submit}
        />
        </article>
    )
}

type DelProps = {
    text: Text;
    delFn: (t: Text) => void;
}

function Del({ text, delFn }: DelProps) {
    const del = () => {
        if (window.confirm("Delete this text?")) {
            delFn(text);
        }
    }
    return <button className="del" onClick={del}><DeleteIcon /></button>
}

type TextLinkProps = {
    text: Text;
    isSingle: boolean;
    isNew: boolean;
}

function TextLink({ text, isSingle, isNew }: TextLinkProps) {
    const name = text.id + ".txt"
    if (!isNew && !isSingle) {
        return <Link className="name" to={"/texts/" + name}>{name}</Link>
    }
    return <span className="name">{!isNew ? "> " : ""}{name}</span>
}


