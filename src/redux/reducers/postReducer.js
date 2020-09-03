import { FETCH_POST, POSTED } from "../types";

const initialState = {
  items: [],
  posted: true,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POST:
      return {
        ...state,
        items: action.payload,
      };
  
    case POSTED:
      return {
        ...state,
        posted: !state.posted,
      };

    default:
      return state;
  }
};

export default postReducer;
