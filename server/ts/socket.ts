import socketio from "socket.io";
import { Server } from "http";
import { BotState } from "./bot";
import { getupdatedata, getcachedupdatedata } from "./bot/get";
import { enqueue, play, remove, skip, p, setvolume } from "./bot/controller";

const createio = (bot: BotState, server: Server) => {
  const io = socketio(server);

  const asyncupdate = async (socket: SocketIO.Socket) => {
    const data = await getupdatedata(bot);
    socket.emit("update", data);
  };

  const update = (socket: SocketIO.Socket) => () => {
    asyncupdate(socket);
    socket.emit("update", getcachedupdatedata(bot));
  };

  let listeners: smap<() => void> = {};

  bot.listener = () => {
    Object.keys(listeners).forEach((k) => listeners[k]());
  };

  io.on("connect", (socket) => {
    const upd = update(socket);

    listeners[socket.id] = upd;

    socket.on("disconnect", () => {
      delete listeners[socket.id];
    });

    socket.on("add", (url: string) => {
      socket.emit("urlstat", enqueue(bot, url));
      play(bot);
    });

    socket.on("remove", (id: string) => {
      remove(bot, id);
    });

    socket.on("skip", () => {
      skip(bot);
    });

    socket.on("p", () => {
      p(bot);
    });

    socket.on("volume", (volume: number) => {
      setvolume(bot, volume);
    });

    upd();
  });

  return io;
};

export default createio;
