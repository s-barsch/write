import { timestamp } from "./date";

const emptyText = () => {
  const ts = timestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime()
  }
}

export default emptyText;
