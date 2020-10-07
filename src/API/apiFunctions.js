import axios from "axios";

var localhost = false;

//#region  import y cabecera ----------------------------------

// import axiosCancel from 'axios-cancel';

// axiosCancel(axios, {
//   debug: false // default
// });
// 192.168.137.1:80"

var HOST = localhost
  ? "http://localhost"
  : "https://sistemadestock.herokuapp.com";

//#endregion import y cabecera

//#region  SECURITY ----------------------------------

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

export const getProfile = (path) => {
  return axios
    .post(
      HOST + "/api/user",
      { path },
      {
        headers: {
          Authorization: `Bearer ${localStorage.usertoken}`,
        },
      }
    )
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

//#endregion SECURITY

//#region  Request Regulares ----------------------------------

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
//#endregion Request Regulares
