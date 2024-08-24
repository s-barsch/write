import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate }  from 'react-router-dom';
//import TextareaAutosize from 'react-textarea-autosize';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { makeKey } from '../funcs/date';
import DeleteIcon from '@mui/icons-material/ClearSharp';
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
        <>{texts.map((text, _i) => (
                <TextField key={makeKey(text.id)} text={text} saveFn={saveFn} delFn={delFn}
                isSingle={false} isNew={false} />
        ))}</>
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

    const navigate = useNavigate();

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

    const submitKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            placeText();
        }
        if (e.ctrlKey && e.key === "Enter") {
            placeGoToNew();
        }
    }

    const submitOnBlur = (_e: React.FormEvent<HTMLTextAreaElement>): void => {
        placeText();
    }

    const placeText = (): void => {
        if (body === '') return
        save();
        if (isNew) {
            navigate("/texts/" + text.id + ".txt")
        }
    }

    const placeGoToNew = (): void => {
        if (body === '') return
        save();
        navigate('/');
    }

    const save = (): void => {
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
        id={text.id}
        ref={textRef}
        minRows={rows}
        value={body}
        onKeyDown={submitKeyDown}
        onBlur={submitOnBlur}
        onChange={handleTyping}
        />
        </article>
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
        { delFn && <Del text={text} delFn={delFn} isNew={isNew} /> }
        </header>
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

function Del({ text, delFn, isNew }: {text: Text; delFn: (t: Text) => void; isNew?: boolean}) {
    const del = () => {
        if (window.confirm("Delete this text?")) {
            delFn(text);
        }
    }
    if (isNew) {
        return null;
    }
    return <button className="del" onClick={del}><DeleteIcon /></button>;
}

function TextLink({ text, isSingle, isNew }: {text: Text; isSingle: boolean; isNew: boolean}) {
    const name = text.id + ".txt"
    if (!isNew && !isSingle) {
        return <Link className="name" to={"/texts/" + name}>{name}</Link>
    }
    return <span className="name">{!isNew ? "> " : ""}{name}</span>
}


