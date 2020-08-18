import { Router } from "express";
import Bot from "../bot";
import path from "path";
import fs from "fs";

const create = (bot: Bot) => {
  // create route
  const router = Router();

  // sm command
  router.put("/sm", (req, res) => {
    // get message
    const msg = req.body["msg"];
    // send message to main, if not exists send 400 back
    if (bot.sendmain(msg)) res.sendStatus(200);
    else res.sendStatus(400);
  });

  router.put("/play", (req, res) => {
    // get url
    const url = req.body["url"];
    // play, if error, send 400
    if (bot.playurl(url)) res.sendStatus(200);
    else res.sendStatus(400);
  });

  router.put("/playq", (req, res) => {
    // return queue
    // res.send(bot.queue);
    // send 400 if no
    if (bot.playqueue()) res.sendStatus(200);
    else res.sendStatus(400);
  });

  router.put("/loadq", (req, res) => {
    // load queue
    const queue = JSON.parse(
      fs.readFileSync(path.join("data", "q.json"), { encoding: "utf8" })
    );
    // return queue
    res.send(queue);
    // set queue on bot
    bot.queue = queue.map((e: { url: string }) => e.url);

    console.log(bot.queue);
  });

  return router;
};

export default create;
