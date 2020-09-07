import axios from "axios";

//localhost??
var HOST = true ? "http://localhost:80" : "https://sistemadestock.herokuapp.com";

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
