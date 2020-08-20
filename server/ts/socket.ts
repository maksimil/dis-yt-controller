import Bot from "./bot";
import socketio from "socket.io";
import { Server } from "http";

const createio = (bot: Bot, server: Server) => {
  const io = socketio(server);

  const update = () => {
    io.emit("update", {
      queue: bot.queue,
      paused: bot.ispaused(),
      channel: bot.getchannel(),
    });
  };

  io.on("connect", (socket) => {
    console.log("New ws");

    socket.on("add", (url: string) => {
      // TODO: url validation
      bot.addurls([url]);
      bot.playqueue();
      update();
    });

    socket.on("remove", (id: string) => {
      bot.remove(id);
      update();
    });

    socket.on("skip", () => {
      bot.skip();
      update();
    });

    socket.on("p", () => {
      bot.p();
      update();
    });

    update();
  });

  return io;
};

export default createio;
