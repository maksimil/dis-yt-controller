import path from "path";
import express from "express";
import ip from "ip";
import queueroute from "./queueroute";
import bodyparser from "body-parser";
import cors from "cors";

// create app
const app = express();

// parse request bodies
app.use(bodyparser.urlencoded({ extended: true }));

// remove cors problems
app.use(cors());

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
