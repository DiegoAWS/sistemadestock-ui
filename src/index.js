import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
// import { Provider } from "react-redux";
// import store from "./redux/store";
import "../node_modules/jquery/dist/jquery";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./assets/styles.css";

ReactDOM.render(
  // <Provider store={store}>
  <App />,
  // </Provider>
  document.getElementById("root")
);
