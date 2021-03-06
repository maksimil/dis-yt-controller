import path from "path";
import express from "express";
import http from "http";
import socket from "./socket";
import config from "../config.json";
import { createbot } from "./bot/create";

// create bot
const bot = createbot(config.token, config.prefix);

// create app
const app = express();

// create server
const server = http.createServer(app);

// create ws
socket(bot, server);

// serve public folder
app.use(express.static(path.join("build")));

// listening
const port = config.port;
const timeout = 1000;
const ip = config.LANip;

const connect = () => {
  try {
    server.listen(port, ip, () => {
      console.log(`Listening on ${port} http://${ip}:${port}`);
    });
  } catch (e) {
    console.error(e);
    console.log(`Reconnectiong after ${timeout}ms`);
    setTimeout(connect, timeout);
  }
};
connect();
