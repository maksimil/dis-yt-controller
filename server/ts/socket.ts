import Bot from "./bot";
import socketio from "socket.io";
import { Server } from "http";

const createio = (bot: Bot, server: Server) => {
  const io = socketio(server);

  const asyncupdate = async (socket: SocketIO.Socket) => {
    const queue = await bot.getqueue();
    socket.emit("update", {
      queue,
      pstatus: bot.playstatus(),
      channel: bot.getchannel(),
      volume: bot.getvolume(),
    });
  };

  const update = (socket: SocketIO.Socket) => () => {
    asyncupdate(socket);
    socket.emit("update", {
      queue: bot.getqueuecached(),
      pstatus: bot.playstatus(),
      channel: bot.getchannel(),
      volume: bot.getvolume(),
    });
  };

  io.on("connect", (socket) => {
    const upd = update(socket);

    bot.addlistener(socket.id, upd);

    socket.on("disconnect", () => {
      bot.removelistener(socket.id);
    });

    socket.on("add", (url: string) => {
      socket.emit("urlstat", bot.addurl(url));
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

    upd();
  });

  return io;
};

export default createio;
