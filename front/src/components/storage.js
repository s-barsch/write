const localStorageKey = "texts";

export const deleteLocal = (texts, t) => {
  texts = texts.filter(el => { return el.id !== t.id });
  saveLocals(texts);
  return texts;
}

export const saveLocal = (texts, t) => {
  texts.forEach(el => {
    if (el.id === t.id) {
      el = t
    }
  });
  saveLocals(texts);
  return texts;
}

export const appendLocal = (texts, t) => {
  texts.push(t);
  saveLocals(texts);
  return texts
}

export const saveLocals = texts => {
  localStorage.setItem(localStorageKey, JSON.stringify(texts));
}


export const getLocals = () => {
  const locals = localStorage.getItem(localStorageKey);
  if (locals == null) {
    return [];
  }
  return JSON.parse(locals);
}
