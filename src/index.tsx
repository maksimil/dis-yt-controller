import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socketio from "socket.io-client";
import { socketurl } from "./config.json";

const socket = socketio(socketurl);

socket.on("update", (state: State) => {
  ReactDOM.render(
    <React.StrictMode>
      <App state={state} socket={socket} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
