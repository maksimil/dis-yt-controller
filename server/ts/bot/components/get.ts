import State from "./state";
import Yt from "./yt";

class Get {
  yt: Yt = new Yt();

  stateref: State;

  constructor(stateref: State) {
    this.stateref = stateref;
  }

  queue = () => {
    const queue = this.stateref.get((state) => state.queue);
    return Promise.all(
      queue.map(async ({ id, url }) => {
        return { id, url, info: await this.yt.get(url) } as updatequentry;
      })
    );
  };

  queuecached = () => {
    const queue = this.stateref.get((state) => state.queue);
    return queue.map(({ id, url }) => {
      return { id, url, info: this.yt.getcache(url) } as updatequentry;
    });
  };

  channel = () => this.stateref.get((state) => state.vc?.channel.name);

  playstatus = (): "play" | "paused" | "notplaying" =>
    this.stateref.get((state) => {
      if (!state.dispatcher) return "notplaying";
      if (state.dispatcher.paused) return "paused";
      else return "play";
    });

  volume = () => this.stateref.get((state) => state.dispatcher?.volume);

  updatedata = async () => {
    return {
      queue: await this.queue(),
      channel: this.channel(),
      pstatus: this.playstatus(),
      volume: this.volume(),
      turlcache: this.yt.getturlcache(),
    } as updatedata;
  };

  cachedupdatedata = () => {
    return {
      queue: this.queuecached(),
      channel: this.channel(),
      pstatus: this.playstatus(),
      volume: this.volume(),
      turlcache: this.yt.getturlcache(),
    } as updatedata;
  };
}

export default Get;
