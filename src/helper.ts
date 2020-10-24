import Text from './funcs/text';

export type ActionFunc = (t: Text) => void;

export type ModFuncs = {
  saveText: ActionFunc;
  deleteText: ActionFunc;
  revertDelete: ActionFunc;
  delWrite: ActionFunc;
}

export type SectionProps = {
    texts: Text[];
    modFuncs: ModFuncs;
}

export type conStatesObj = {
    isOffline: boolean;
    isConnecting: boolean;
}

export type SwitchFuncs = {
    theme: () => void;
    connection: () => void;
}
