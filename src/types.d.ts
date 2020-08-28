type vidinfo = {
  title: string;
  duration: number;
};

type qentry = {
  info: vidinfo;
  id: string;
  url: string;
};

type AppProps = {
  socket: SocketIOClient.Socket;
  state: State;
};

type AppState = {
  socket: SocketIOClient.Socket;
  state: State;
  innerstate: {
    lastvalid: boolean;
  };
};

type State = {
  channel: string | undefined;
  queue: qentry[];
  pstatus: "play" | "paused" | "notplaying";
  volume: number | undefined;
  turlcache: { [key: string]: string };
};

type fetchdata = {
  queue: qentry[];
};

declare module "*.json" {
  const value: any;
  export default value;
}
