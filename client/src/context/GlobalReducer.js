export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };

    case "SET_COMPLETE_TODOS":
      return {
        ...state,
        completeTodos: action.payload,
      };

    case "SET_INCOMPLETE_TODOS":
      return {
        ...state,
        incompleteTodos: action.payload,
      };

    case "RESET_USER":
      return {
        ...state,
        user: null,
        fetchingUser: false,
        completeTodos: [],
        incompleteTodos: [],
      };
    default:
      break;
  }
};
