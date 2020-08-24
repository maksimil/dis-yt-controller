import Get from "./components/get";
import State from "./components/state";
import Discord from "./components/discord";
import Controller from "./components/controller";

class Bot {
  get: Get;
  state: State;
  discord: Discord;
  controller: Controller;

  constructor(token: string, prefix: string) {
    this.state = new State();
    this.discord = new Discord(this.state, token, prefix);
    this.controller = Controller(this.state);
    this.get = new Get(this.state);
  }
}

export default Bot;
