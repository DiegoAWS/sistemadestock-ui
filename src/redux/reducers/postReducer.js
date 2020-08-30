import {
  FETCH_POST,
  ADD_COUNTER,
  FORM_CHANGE,
  CLEAR_FORM,
  POSTED,
} from "../types";

const initialState = {
  items: [],

  name: "",
  coment: "",
  posted: true,
  counter: 0,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POST:
      return {
        ...state,
        items: action.payload,
      };

    case ADD_COUNTER:
      return {
        ...state,
        counter: state.counter + 1,
      };

    case FORM_CHANGE:
      if (action.payload.element === "name")
        return {
          ...state,
          name: action.payload.value,
        };
      else
        return {
          ...state,
          coment: action.payload.value,
        };
    case CLEAR_FORM:
      return {
        ...state,
        name: "",
        coment: "",
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
