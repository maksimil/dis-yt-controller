import { Router } from "express";
import Bot from "./bot";

const create = (bot: Bot) => {
  // create route
  const router = Router();

  // sm command
  router.put("/sm", (req, res) => {
    // get message
    const msg = req.body["msg"];
    // send message to main, if not exists send 400 back
    res.sendStatus(bot.sendmain(msg) ? 200 : 400);
  });

  // play/pause
  router.put("/p", (req, res) => {
    // send 400 if not in vc
    res.sendStatus(bot.p() ? 200 : 400);
  });

  // add song to queue
  router.put("/add", (req, res) => {
    // add url
    bot.addurl(req.body["url"]);
    // play
    res.sendStatus(bot.playqueue() ? 200 : 400);
  });

  return router;
};

export default create;
