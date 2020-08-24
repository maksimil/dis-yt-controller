import Bot from "./bot/bot";
import socketio from "socket.io";
import { Server } from "http";

const createio = (bot: Bot, server: Server) => {
  const io = socketio(server);

  const asyncupdate = async (socket: SocketIO.Socket) => {
    const data = await bot.get.updatedata();
    socket.emit("update", data);
  };

  const update = (socket: SocketIO.Socket) => () => {
    asyncupdate(socket);
    socket.emit("update", bot.get.cachedupdatedata());
  };

  io.on("connect", (socket) => {
    const upd = update(socket);

    bot.state.addlistener(upd, socket.id);

    socket.on("disconnect", () => {
      bot.state.removelistener(socket.id);
    });

    socket.on("add", (url: string) => {
      socket.emit("urlstat", bot.controller.enqueue(url));
      bot.controller.play();
    });

    socket.on("remove", (id: string) => {
      bot.controller.remove(id);
    });

    socket.on("skip", () => {
      bot.controller.skip();
    });

    socket.on("p", () => {
      bot.controller.p();
    });

    socket.on("volume", (volume: number) => {
      bot.controller.setvolume(volume);
    });

    upd();
  });

  return io;
};

export default createio;
