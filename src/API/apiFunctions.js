import axios from "axios";

// import axiosCancel from 'axios-cancel';

// axiosCancel(axios, {
//   debug: false // default
// });
//"http://localhost"

var HOST = !window.location.href.toString().includes(".com")
  ? "http://192.168.137.1"
  : "https://sistemadestock.herokuapp.com";

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
      localStorage.removeItem("usertoken");
      localStorage.removeItem("UserOficialName");
      localStorage.removeItem("UserRole");
      setTimeout(() => {
        window.location.replace(window.location.origin);
      }, 1000);
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
