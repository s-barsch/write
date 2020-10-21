import { newTimestamp } from "./date";

type Text = {
    id:   string,
    path: string,
    body: string,
    mod:  number,
    firstEdit: boolean,
}

export default Text;

export function emptyText(): Text {
  const ts = newTimestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime(),
    firstEdit: true
  }
}

export function demoText(): Text {
  let t = emptyText();
  t.body = "This is a demo entry."
  t.firstEdit = false;
  return t;
}
