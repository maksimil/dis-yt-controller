import Queue from "./queue";
import Listen from "./listen";
import { VoiceConnection, StreamDispatcher } from "discord.js";

class State extends Listen<{
  queue: Queue<string>;
  vc: VoiceConnection | undefined;
  dispatcher: StreamDispatcher | undefined;
}> {
  constructor() {
    super({ queue: new Queue(), vc: undefined, dispatcher: undefined });
  }

  getproperty = (v: "queue" | "vc" | "dispatcher") => this.state[v];
}

export default State;
