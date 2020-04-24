export const hasEntry = (list, t) => {
  list.forEach(el => {
    if (el.id === t.id) {
      return true;
    }
  });
  return false;
}

export const updateList = (list, t) => {
  let is = false;
  list.forEach(el => {
    if (el.id === t.id) {
      el = t
      is = true;
    }
  });
  if (!is) {
    list= [t].concat(list);
  }
  return list;
}

export const trimList = (list, t) => {
  return list.filter(el => { return el.id !== t.id });
}


