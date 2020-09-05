import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";

import "../node_modules/jquery/dist/jquery";

import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
// import "../node_modules/bootstrap/dist/css/bootstrap.css";
import './assets/bootstrap.css'
import "../node_modules/datatables.net-dt/css/jquery.dataTables.css";

import "./assets/styles.css";

ReactDOM.render(
  <App />,

  document.getElementById("root")
);
