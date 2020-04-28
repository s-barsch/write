import React from 'react';
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

const Info = ({ text, submit, delFn }) => {
  return (
    <header>
      <Link className="name" to={"/texts/" + text.id + ".txt"}>{text.id + ".txt"}</Link>
      <button className="mod">{text.mod.toString(16).substr(-6)}</button>
      { delFn && <Del text={text} delFn={delFn} /> }
    </header>
  )
}

export const Text = ({ text, saveFn, delFn, minRows, focus }) => {
  const submit = e => {
    if (e.target.value === "") {
      return
    }
    /*
    const target = e.target;
    if (target.value === text.body && target.classList.value !== "mod") {
      return;
    }
    */
    text.mod  = Date.now();
    text.body = e.target.value;
    saveFn(text);
  }

  if (minRows > 5) {
    minRows = Math.round(window.screen.height/(2.25*16)) - 6;
  }

  return (
    <article className="text">
      <Info text={text} submit={submit} delFn={delFn} />
    <TextareaAutosize autoFocus={focus ? true : false} minRows={minRows} defaultValue={text.body} onBlur={submit} />
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


