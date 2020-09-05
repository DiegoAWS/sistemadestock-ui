import axios from "axios";
import "dotenv/config";

var HOST =
  process.env.NODE_ENV === "development"
    ? ""
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
export const postRequest = (url,data) => {
  return axios
    .post(HOST + "/api" + url,data, {
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

export const deleteRequest = (url) => {
  return axios
    .post(HOST + "/api" + url, {
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
