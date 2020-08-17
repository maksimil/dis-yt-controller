import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";

axios.get("http://localhost:5000/q/q").then((res) => {
  ReactDOM.render(
    <React.StrictMode>
      <App
        state={{
          queue: res.data,
        }}
      />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
