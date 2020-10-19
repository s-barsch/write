import React, { useState, useEffect, useRef } from 'react';
import { Link }  from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { makeKey } from "../funcs/date";
import DeleteIcon from '@material-ui/icons/ClearSharp';
import { File } from '../funcs/file';
import Error from './error';

type ActionFunc = (f: File) => void;

type TextListProps = {
    texts:  File[];
    saveFn: (f: File) => void;
    delFn:  (f: File) => void;
}

export function TextList({ texts, saveFn, delFn }: TextListProps) {
    if (!texts || texts.length === 0) {
        return (
            <Error message={<>No <samp>Texts</samp> found.</>} />
        )
    }
    return (
        texts.map((text, i) => (
            <Text key={makeKey(text.id)} text={text} saveFn={saveFn} delFn={delFn}
            isSingle={false} isNew={false} />
        ))
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
    text: File;
    isSingle: boolean;
    isNew: boolean;
    saved: number; 
    delFn: ActionFunc;
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
    text: File;
    saveFn: ActionFunc;
    delFn: ActionFunc;
    isSingle: boolean;
    isNew: boolean;
}

export function Text({ text, saveFn, delFn, isSingle, isNew }: TextProps) {
    const [body, setBody] = useState(text.body);
    const [saved, setSaved] = useState(0);

    useEffect(() => {
        setBody(text.body)
    }, [text.body]);

    const textRef = useRef<HTMLTextAreaElement>(null!);

    useEffect(() => {
        if (isSingle) {
            textRef.current.focus({preventScroll:true});
        }
        if (!isNew && isSingle && text.firstEdit) {
            blinkGreen();
            text.firstEdit = false;
        }
    }, [isSingle, isNew, text]);

    const handleTyping = (e: React.FormEvent<HTMLTextAreaElement>): void => {
        setSaved(1);
        setBody(e.currentTarget.value);
    }

    const blinkGreen = () => {
        setSaved(2);
        setTimeout(() => {
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
        blinkGreen();
    }

    let rows = !isSingle ? 1 : screenRows();

    return (
        <article className="text">
        <Info text={text} saved={saved} isSingle={isSingle} isNew={isNew} delFn={delFn} />
        <TextareaAutosize
        inputRef={textRef}
        minRows={rows}
        value={body}
        onChange={handleTyping}
        onBlur={submit}
        />
        </article>
    )
}

type DelProps = {
    text: File;
    delFn: ActionFunc;
}

function Del({ text, delFn }: DelProps) {
    const del = () => {
        if (window.confirm("Delete this text?")) {
            delFn(text);
        }
    }
    return <button className="del" onClick={del}><DeleteIcon /></button>
}

function screenRows() {
    return Math.round(window.screen.height/(2.25*16)) - 6;
}

type TextLinkProps = {
    text: File;
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


