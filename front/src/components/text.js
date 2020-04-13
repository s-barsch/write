import React from "react"; 

const Text = ({ text, saveFn }) => {
  const submit = e => {
    if (e.target.value === text.body) {
      return;
    }
    saveFn(e.target.value)
  }
  return (
    <textarea defaultValue={text.body} onBlur={submit}></textarea>
  )
}

export default Text
