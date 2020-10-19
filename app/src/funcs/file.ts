import { newTimestamp } from "./date";

export type File = {
    id:   string,
    path: string,
    body: string,
    mod:  number,
    firstEdit: boolean,
}

export default function emptyText(): File {
  const ts = newTimestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime(),
    firstEdit: true
  }
}

export function demoText(): File {
  let t = emptyText();
  t.body = "This is a demo entry."
  t.firstEdit = false;
  return t;
}
