import path from "path";
import express from "express";
import ip from "ip";
import createqueueroute from "./routes/queue";
import bodyparser from "body-parser";
import cors from "cors";
import Bot from "./bot";
import fs from "fs";
import createbotroute from "./routes/bot";

// read configs
// config: {token, prefix, port}
const config = JSON.parse(
  fs.readFileSync(path.join("server", "config.json"), { encoding: "utf8" })
);

// create bot
const bot = new Bot(config.token, config.prefix);

// create app
const app = express();

// parse request bodies
app.use(bodyparser.urlencoded({ extended: true }));

// remove cors problems
app.use(cors());

// ui
app.use(express.static(path.join(__dirname, "..", "..", "build")));

// apis
app.use("/q", createqueueroute());
app.use("/bot", createbotroute(bot));

// listening
const port = config.port;

app.listen(port, () => {
  console.log(`Listening on ${port} http://localhost:${port}`);
  console.log(`Listening on ${port} http://${ip.address()}:${port}`);
});
