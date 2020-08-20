import path from "path";
import express from "express";
import ip from "ip";
import Bot from "./bot";
import fs from "fs";
import http from "http";
import socket from "./socket";

// read configs
// config: {token, prefix, port}
const config = JSON.parse(
  fs.readFileSync(path.join("server", "config.json"), { encoding: "utf8" })
);

// create bot
const bot = new Bot(config.token, config.prefix);

// create app
const app = express();

// create server
const server = http.createServer(app);

// create ws
socket(bot, server);

// serve public folder
app.use(express.static(path.join(__dirname, "..", "..", "build")));

// listening
const port = config.port;
const timeout = 1000;

const connect = () => {
  try {
    server.listen(port, () => {
      console.log(`Listening on ${port} http://localhost:${port}`);
      console.log(`Listening on ${port} http://${ip.address()}:${port}`);
    });
  } catch (e) {
    console.error(e);
    console.log(`Reconnectiong after ${timeout}ms`);
    setTimeout(connect, timeout);
  }
};
connect();
