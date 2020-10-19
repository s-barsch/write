import { File } from './funcs/file';

type ActionFunc = (f: File) => void;

export type ModFuncs = {
  deleteFile: ActionFunc;
  writeFile: ActionFunc;
  revertDelete: ActionFunc;
  delWrite: ActionFunc;
}


