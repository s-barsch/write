import Text from './funcs/text';

export type ModFuncs = {
  saveText: (t: Text) => void;
  deleteText: (t: Text) => void;
  revertDelete: (t: Text) => void;
  delWrite: (t: Text) => void;
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
    connection: () => void;
}
