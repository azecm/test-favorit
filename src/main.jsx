import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";

import { store } from "./store.js";
import { App } from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root") ?? document.createElement("div")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
