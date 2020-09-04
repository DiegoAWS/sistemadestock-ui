import axios from "axios";
import "dotenv/config";

var HOST =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://sistemadestock.herokuapp.com";

export const register = (newUser) => {
  return axios
    .post(HOST + "/api/auth/signup", newUser, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const login = (user) => {
  return axios
    .post(
      HOST + "/api/auth/login",
      {
        username: user.username,
        password: user.password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => {
     localStorage.setItem("usertoken", response.data.access_token);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProfile = () => {
  axios.defaults.headers.post["X-CSRF-Token"] = localStorage.usertoken;
  axios.defaults.headers.post[
    "Authorization"
  ] = `Bearer ${localStorage.usertoken}`;

  return axios
    .get(HOST + "/api/auth/user")
    .then((response) => {
      return response;
    })
    .catch((err) => {
     

      console.log(err);
    });
};
