import axios from "axios";
import "dotenv/config";

var HOST =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://sistemadestock.herokuapp.com";

export const userSecure = () => {
  axios.defaults.headers.post["X-CSRF-Token"] = localStorage.usertoken;
  axios.defaults.headers.post[
    "Authorization"
  ] = `Bearer ${localStorage.usertoken}`;

  return axios
    .post(HOST + "/api/user", {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
export const user = () => {
  return axios
    .post(HOST + "/api/user", {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
