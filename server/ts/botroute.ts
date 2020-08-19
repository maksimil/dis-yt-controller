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
    // add url and play if not playing
    bot.addurls([req.body["url"]]);
    bot.playqueue();
    // return queue
    res.send(bot.queue);
  });

  // skip
  router.put("/skip", (req, res) => {
    res.sendStatus(bot.skip() ? 200 : 400);
  });

  // remove
  router.put("/remove", (req, res) => {
    // remove by id
    bot.remove(req.body["id"]);
    // return queue
    res.send(bot.queue);
  });

  // get queue
  router.get("/getq", (req, res) => {
    res.send(bot.queue);
  });

  return router;
};

export default create;
