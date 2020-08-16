import { Router } from "express";
import fs from "fs";
import path from "path";

// create route
const router = Router();

// paths
const fodler = path.join("data");
const datapath = path.join(fodler, "q.data");

// check if data file exists
if (!fs.existsSync(datapath)) {
  fs.mkdirSync(fodler);
  fs.writeFileSync(datapath, "");
}

// get queue
router.get("/q", (req, res) => {
  // getting urks from file
  const filecontents = fs.readFileSync(datapath, { encoding: "utf8" });
  const data = filecontents.split("\n");

  // removing last empty
  data.pop();

  // sending data
  res.send(JSON.stringify(data));
});

// add to queue
router.post("/add", (req, res) => {
  // TODO: validate the url
  // writing the url into file
  const fstream = fs.createWriteStream(datapath, {
    flags: "a",
  });
  fstream.write(`${req.body["url"]}\n`);
  fstream.close();

  res.sendStatus(200);
});

// export router
export default router;
