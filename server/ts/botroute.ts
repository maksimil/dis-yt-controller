import { Router } from "express";
import Bot from "./bot";

const createbotroute = (bot: Bot) => {
  // create route
  const router = Router();

  // sm command
  router.put("/sm", (req, res) => {
    // get message
    const msg = req.body["msg"];
    // send message to main, if not exists send 400 back
    if (bot.sendmain(msg)) {
      res.sendStatus(200);
    } else {
      res.send(400);
    }
  });

  return router;
};

export default createbotroute;
