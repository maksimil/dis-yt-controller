import path from "path";
import express from "express";
import ip from "ip";
import queueroute from "./queueroute";
import bodyparser from "body-parser";

// create app
const app = express();

// parse POST bodies
app.use(bodyparser.urlencoded({ extended: true }));

// ui
app.use(express.static(path.join(__dirname, "..", "..", "build")));

// api
app.use("/q", queueroute);

// listening
const port = 5000;

app.listen(port, () => {
  console.log(`Listening on ${port} http://localhost:${port}`);
  console.log(`Listening on ${port} http://${ip.address()}:${port}`);
});
