type vidinfo = {
  title: string;
  duration: number;
};

type qentry = {
  info: vidinfo;
  id: string;
};

type AppState = {
  socket: SocketIOClient.Socket;
  state: State;
};

type State = {
  channel: string | undefined;
  queue: qentry[];
  pstatus: "play" | "paused" | "notplaying";
};
