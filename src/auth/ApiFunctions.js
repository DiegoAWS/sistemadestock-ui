import axios from "axios";

//localhost??
var HOST = true
  ? "http://localhost:80"
  : "https://sistemadestock.herokuapp.com";

export const getRequest = (url) => {
  return axios
    .get(HOST + "/api" + url, {
      headers: {
        Authorization: `Bearer ${localStorage.usertoken}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
export const postRequest = (url, data) => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.usertoken}`;
  return axios
    .post(HOST + "/api" + url, data)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteRequest = (url) => {
  return axios
    .delete(HOST + "/api" + url, {
      headers: {
        Authorization: `Bearer ${localStorage.usertoken}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
