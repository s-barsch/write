import Text from './text';

export function hasEntry(list: Text[], t: Text): boolean {
    list.forEach(el => {
        if (el.id === t.id) {
            return true;
        }
    });
    return false;
}

export function updateList(list: Text[], t: Text): Text[] {

    let isPresent = false;

    list.forEach(el => {
        if (el.id === t.id) {
            el = t
            isPresent = true;
        }
    });

    if (isPresent) {
        return list
    }

    return [t].concat(list);
}

export function trimList(list: Text[], t: Text): Text[] {
    return list.filter(el => {
        return el.id !== t.id
    });
}


