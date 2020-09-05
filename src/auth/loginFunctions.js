import axios from "axios";
import "dotenv/config";

var HOST =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://sistemadestock.herokuapp.com";

export const register = (newUser) => {
  return axios
    .post(HOST + "/api/auth/signup", newUser)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const login = (user) => {
  return axios
    .post(HOST + "/api/auth/login", user)
    .then((response) => {
      localStorage.setItem("usertoken", response.data.access_token);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProfile = () => {
  return axios
    .get(HOST + "/api/auth/user", {
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

export const logout = () => {
  return axios
    .get(HOST + "/api/auth/logout", {
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
