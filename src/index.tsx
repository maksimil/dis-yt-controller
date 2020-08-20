import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socketio from "socket.io-client";

const socket = socketio("http://localhost:5000");

socket.on("update", (state: State) => {
  ReactDOM.render(
    <React.StrictMode>
      <App state={state} socket={socket} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
