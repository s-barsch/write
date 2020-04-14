import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';


export const Texts = ({ texts, saveFn }) => {
  return (
    texts.map((text, i) => (
      <Text key={i} text={text} saveFn={saveFn} />
    ))
  )
}

export const Text = ({ text, saveFn, delFn }) => {
  const submit = e => {
    if (e.target.value === text.body) {
      return;
    }
    text.body = e.target.value;
    saveFn(text);
  }
  return (
    <article className="text">
      <TextareaAutosize defaultValue={text.body} onBlur={submit} />
      <Del delFn={delFn} />
    </article>
  )
}

const Del = ({ delFn }) => {
  return <span className="del">✕</span>
}


