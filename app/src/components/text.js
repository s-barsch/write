import React from 'react';
import { Link }  from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { makeKey } from "../funcs/date";

export const TextList = ({ texts, saveFn, delFn }) => {
  return (
    texts.map((text, i) => (
      <Text key={makeKey(text.id)} text={text} saveFn={saveFn} delFn={delFn} />
    ))
  )
}

const Info = ({ text }) => {
  return (
    <header>
      <Link className="name" to={"/texts/" + text.id + ".txt"}>{text.id + ".txt"}</Link>
      <span className="mod">{text.mod.toString(16).substr(-7)}</span>
    </header>
  )
}

export const Text = ({ text, saveFn, delFn, minRows, focus }) => {
  const submit = e => {
    if (e.target.value === text.body) {
      return;
    }
    text.mod  = Date.now();
    text.body = e.target.value;
    saveFn(text);
  }

  if (minRows > 5) {
    minRows = Math.round(window.outerHeight/(2.25*16)) - 8;
  }

  return (
    <article className="text">
      { delFn && <Del text={text} delFn={delFn} /> }
      <Info text={text} />
    <TextareaAutosize autoFocus={focus ? true : false} minRows={minRows} defaultValue={text.body} onBlur={submit} />
    </article>
  )
}

const Del = ({ text, delFn }) => {
  const del = () => {
    delFn(text);
    /*
    if (window.confirm("Delte this text?")) {
    }
    */
  }
  return <span className="del" onClick={del}>✕</span>
}


