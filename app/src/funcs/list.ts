import { File } from './file';

export function hasEntry(list: File[], f: File): boolean {
    list.forEach(el => {
        if (el.id === f.id) {
            return true;
        }
    });
    return false;
}

export function updateList(list: File[], f: File): File[] {

    let isPresent = false;

    list.forEach(el => {
        if (el.id === f.id) {
            el = f
            isPresent = true;
        }
    });

    if (isPresent) {
        return list
    }

    return [f].concat(list);
}

export function trimList(list: File[], f: File): File[] {
    return list.filter(el => {
        return el.id !== f.id
    });
}


