import React from 'react';

import { TextList } from "../text";
import { SectionProps } from '../../helper';

function Texts({texts, modFuncs}: SectionProps) {
    return <TextList texts={texts} saveFn={modFuncs.saveText} delFn={modFuncs.deleteText} />
}

export default Texts;
