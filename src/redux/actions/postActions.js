import { FETCH_POST, NEW_POST } from "./types";

export const fetchPost = () => (dispatch) => {
  fetch("http://localhost:5000/api")
    .then((res) => res.json())

    .then((posts) =>
      dispatch({
        type: FETCH_POST,
        payload: posts,
      })
    );
  return {};
};
