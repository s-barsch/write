import { TextList } from '../text';
import useWriteStore from '../../stores/states';

function Texts() {
    const { states, saveText, deleteText } = useWriteStore();
    let texts = states["texts"];
    return <TextList texts={texts} saveFn={saveText} delFn={deleteText} />
}

export default Texts;
