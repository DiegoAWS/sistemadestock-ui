import axios from "axios";


var localhost=false


var HOST = localhost
  ? "http://localhost:80"
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


//#endregion SECURITY



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
