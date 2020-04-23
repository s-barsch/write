export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TEXT":
      return [
        ...state,
        {
          id:   action.text.id,
          body: action.text.body
        }
      ];
    default:
      return state;
  }
};
