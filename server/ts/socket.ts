import Bot from "./bot";
import socketio from "socket.io";
import { Server } from "http";

const createio = (bot: Bot, server: Server) => {
  const io = socketio(server);

  const update = () => {
    io.emit("update", {
      queue: bot.getqueue(),
      pstatus: bot.playstatus(),
      channel: bot.getchannel(),
    });
  };

  io.on("connect", (socket) => {
    bot.addlistener(socket.id, update);

    socket.on("disconnect", () => {
      bot.removelistener(socket.id);
    });

    socket.on("add", (url: string) => {
      // TODO: url validation
      bot.addurls([url]);
      bot.playqueue();
    });

    socket.on("remove", (id: string) => {
      bot.remove(id);
    });

    socket.on("skip", () => {
      bot.skip();
    });

    socket.on("p", () => {
      bot.p();
    });

    update();
  });

  return io;
};

export default createio;
