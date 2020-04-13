import { timestamp } from "./date";

const newText = () => {
  const ts = timestamp();
  return {
    id:   ts,
    path: ts + ".txt",
    body: "",
    mod:  new Date().getTime()
  }
}

export default newText;
