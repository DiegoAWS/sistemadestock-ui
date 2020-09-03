import axios from "axios";
import "dotenv/config";

var HOST =
  process.env.NODE_ENV === "development"
    ? ""
    : "https://sistemadestock.herokuapp.com";
export const register = (newUser) => {
  return axios.post(HOST + "/api/register", newUser, {
    headers: { "Content-Type": "application/json" },
  });
};

export const login = (user) => {
  return axios
    .post(
      HOST + "/api/login",
      {
        username: user.username,
        password: user.password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => {
      localStorage.setItem("usertoken", response.data.token);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProfile = () => {
  return axios
    .get(HOST + "/api/profile", {
      headers: { Authorization: `Bearer ${localStorage.usertoken}` },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
