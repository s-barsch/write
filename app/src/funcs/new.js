import { newTimestamp } from "./date";

const emptyText = () => {
  const ts = newTimestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime()
  }
}

export default emptyText;
