import Bot from "./bot";
import socketio from "socket.io";
import { Server } from "http";

const createio = (bot: Bot, server: Server) => {
  const io = socketio(server);

  const asyncupdate = async () => {
    const queue = await bot.getqueue();
    io.emit("update", {
      queue,
      pstatus: bot.playstatus(),
      channel: bot.getchannel(),
      volume: bot.getvolume(),
    });
  };

  const update = () => {
    asyncupdate();
    io.emit("update", {
      queue: bot.getqueuecached(),
      pstatus: bot.playstatus(),
      channel: bot.getchannel(),
      volume: bot.getvolume(),
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

    socket.on("volume", (volume: number) => {
      bot.setvolume(volume);
    });

    update();
  });

  return io;
};

export default createio;
