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
      <span className="mod">({text.mod.toString().substr(-3)})</span>
    </header>
  )
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
    { delFn && <Del text={text} delFn={delFn} /> }
      <Info text={text} />
      <TextareaAutosize minRows={5} defaultValue={text.body} onBlur={submit} />
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


