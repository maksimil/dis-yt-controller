import path from "path";
import express from "express";
import ip from "ip";
import bodyparser from "body-parser";
import cors from "cors";
import Bot from "./bot";
import fs from "fs";
import createbotroute from "./botroute";
import http from "http";
import socketio from "socket.io";

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
const io = socketio(server);

// connect to user
io.on("connect", (socket) => {
  socket.emit("update", bot.queue);
});

// parse request bodies
app.use(bodyparser.urlencoded({ extended: true }));

// remove cors problems
app.use(cors());

// ui
app.use(express.static(path.join(__dirname, "..", "..", "build")));

// apis
app.use(createbotroute(bot));

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
