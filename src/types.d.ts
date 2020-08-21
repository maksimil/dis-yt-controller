type qentry = {
  info: {
    title: string;
  };
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
