import socketio from "socket.io";
import { Server } from "http";
import { BotState } from "./bot";
import { fetchasyncdata, getcachedupdatedata } from "./bot/get";
import { enqueue, play, remove, skip, p, setvolume } from "./bot/controller";

type SocketEmmiter = SocketIO.Server | SocketIO.Socket;

const createio = (bot: BotState, server: Server) => {
  const io = socketio(server);

  const fetchdata = async (emmiter: SocketEmmiter) => {
    emmiter.emit("fetch", await fetchasyncdata(bot));
  };

  const update = (emmiter: SocketEmmiter) => {
    fetchdata(emmiter);
    emmiter.emit("update", getcachedupdatedata(bot));
  };

  bot.listener = () => update(io);

  io.on("connect", (socket) => {
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

    update(socket);
  });

  return io;
};

export default createio;
