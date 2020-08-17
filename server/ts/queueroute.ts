import { Router } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuid4 } from "uuid";

// create route
const router = Router();

// paths
const folder = path.join("data");
const datapath = path.join(folder, "q.json");

// check if data folder and file exist
if (!fs.existsSync(datapath)) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  fs.writeFileSync(datapath, "[]");
}

// queue entry type
type qentry = {
  url: string;
  id: string;
};

// get queue from file
const getqdata = (): qentry[] => {
  return JSON.parse(fs.readFileSync(datapath, { encoding: "utf8" }));
};

// write q data to file
const writeqdata = (data: qentry[]) => {
  fs.writeFileSync(datapath, JSON.stringify(data));
};

// get queue
router.get("/q", (req, res) => {
  // res.send(fs.readFileSync(datapath, { encoding: "utf8" }));
  res.send(getqdata());
});

// add to queue
router.put("/add", (req, res) => {
  // TODO: validate the url

  // writing data into file
  let queue = getqdata();
  queue.push({
    url: req.body["url"],
    // assinging unique id
    id: uuid4(),
  });
  writeqdata(queue);

  res.sendStatus(200);
});

// remove from queue
router.delete("/remove", (req, res) => {
  // get id from request
  const id = req.body["id"];

  // remove from q and check if entry exists
  let found = false;
  const queue = getqdata().filter((e) => {
    if (e.id === id) {
      found = true;
      return false;
    }
    return true;
  });

  if (!found) {
    // return client error if did not remove
    res.sendStatus(400);
    return;
  }

  writeqdata(queue);
  res.sendStatus(200);
});

// export router
export default router;
