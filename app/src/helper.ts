import { File } from './funcs/file';

export type ActionFunc = (f: File) => void;

export type ModFuncs = {
  saveText: ActionFunc;
  deleteText: ActionFunc;
  revertDelete: ActionFunc;
  delWrite: ActionFunc;
}

export type SectionProps = {
    texts: File[];
    modFuncs: ModFuncs;
}

export type ConStates = {
    offline: boolean;
    connecting: boolean;
}

export type SwitchFuncs = {
    theme: () => void;
    connection: () => void;
}
