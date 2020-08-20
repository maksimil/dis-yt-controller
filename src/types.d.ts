type qentry = {
  url: string;
  id: string;
};

type AppState = {
  socket: SocketIOClient.Socket;
  state: State;
};

type State = {
  channel: string | undefined;
  queue: qentry[];
  paused: boolean | undefined;
};
