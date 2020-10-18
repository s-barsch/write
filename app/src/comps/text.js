import React, { useState, useEffect, useRef } from 'react';
import { Link }  from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { makeKey } from "../funcs/date";
import DeleteIcon from '@material-ui/icons/ClearSharp';
import Error from './error';

export const TextList = ({ texts, saveFn, delFn }) => {
  if (!texts || texts.length === 0) {
    return (
      <Error message={<>No <samp>Texts</samp> found.</>} />
    )
  }
  return (
    texts.map((text, i) => (
      <Text key={makeKey(text.id)} text={text} saveFn={saveFn} delFn={delFn} />
    ))
  )
}

const Saved = ({saved, mod}) => {
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

const Info = ({ text, single, saved, highlight, delFn }) => {
  return (
    <header className="info">
      <TextLink text={text} single={single} highlight={highlight}>
        {text.id + ".txt"}
      </TextLink>
      <Saved saved={saved} mod={text.mod.toString(16).substr(-6)} />
      { delFn && <Del text={text} delFn={delFn} /> }
    </header>
  )
}

export const Text = ({ text, saveFn, delFn, single, highlight }) => {
  const [body, setBody] = useState(text.body);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
      setBody(text.body)
  }, [text.body]);

  const textRef = useRef(null);

  useEffect(() => {
    if (single) {
      textRef.current.focus({preventScroll:true});
    }
  }, [single]);

  const handleTyping = event => {
    setSaved(1);
    setBody(event.target.value);
  }

  const submit = e => {
    if (body === "") {
      return
    }
    /*
    const target = e.target;
    if (target.classList.value !== "mod") {
      return;
    }
    */
    text.mod  = Date.now();
    text.body = body;
    saveFn(text);
    setSaved(2);
    setTimeout(() => {
      setSaved(0);
    }, 600);
  }

  let rows = !single ? 1 : screenRows();

  return (
    <article className="text">
      <Info text={text} single={single} saved={saved} highlight={highlight} delFn={delFn} />
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

const Del = ({ text, delFn }) => {
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

const TextLink = ({ text, single, highlight, children }) => {
  const className = highlight ? "active " : "";
  if (!single) {
    return <Link className="name" to={"/texts/" + text.id + ".txt"}>{children}</Link>
  }
  return <span className={className + "name"}>{children}</span>
}


