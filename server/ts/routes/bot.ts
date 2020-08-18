import { Router } from "express";
import Bot from "../bot";

const create = (bot: Bot) => {
  // create route
  const router = Router();

  // sm command
  router.put("/sm", (req, res) => {
    // get message
    const msg = req.body["msg"];
    // send message to main, if not exists send 400 back
    if (bot.sendmain(msg)) res.sendStatus(200);
    else res.send(400);
  });

  router.put("/play", (req, res) => {
    // get url
    const url = req.body["url"];
    // play, if error, send 400
    if (bot.playurl(url)) res.sendStatus(200);
    else res.sendStatus(400);
  });

  return router;
};

export default create;
