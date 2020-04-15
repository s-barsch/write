import React from 'react';
import { Link }  from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { makeNumber } from "./date";


export const Texts = ({ texts, saveFn, delFn }) => {
  return (
    texts.map((text, i) => (
      <Text key={makeNumber(text.id)} text={text} saveFn={saveFn} delFn={delFn} />
    ))
  )
}

const Info = ({ text }) => {
  return (
    <header>
      <Link className="id" to={"/texts/" + text.id + ".txt"}>{text.id}</Link>
      <Mod mod={text.mod} />
    </header>
  )
}

const Mod = ({ mod }) => {
  return <span className="mod">{mod}</span>
}

export const Text = ({ text, saveFn, delFn }) => {
  const submit = e => {
    if (e.target.value === text.body) {
      return;
    }
    text.mod  = Date.now();
    text.body = e.target.value;
    saveFn(text);
  }
  return (
    <article className="text">
      {delFn ? (
        <Del text={text} delFn={delFn} />
      ):(null)}
      <Info text={text} />
      <TextareaAutosize minRows={1} defaultValue={text.body} onBlur={submit} />
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


