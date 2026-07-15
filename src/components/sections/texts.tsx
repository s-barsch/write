import { TextList } from '../text';
import useWriteStore from '../../stores/states';
import { NavLink } from 'react-router-dom';

function Texts() {
    const { states, saveText, deleteText } = useWriteStore();
    let texts = states["texts"];
    return (
        <>
            <TextList texts={texts} saveFn={saveText} delFn={deleteText} />
            <NavLink to="/login">Login</NavLink>
        </>
    )
}

export default Texts;
