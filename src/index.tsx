import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import socketio from "socket.io-client";

const socket = socketio("http://localhost:5000");

socket.on("update", (data: qentry[]) => {
  ReactDOM.render(
    <React.StrictMode>
      <App queue={data} socket={socket} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
