import { newTimestamp } from "./date";

const emptyText = () => {
  const ts = newTimestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime(),
    firstEdit: true
  }
}

const demoText = () => {
  let t = emptyText();
  t.body = "This is a demo entry."
  t.firstEdit = false;
  return t;
}

export { demoText };

export default emptyText;
