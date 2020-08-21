import {
  Client,
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  StreamDispatcher,
} from "discord.js";
import ytdl from "ytdl-core";
import { v4 as uuidv4 } from "uuid";
import CacheMap from "./cachemap";
import path from "path";

type qentry = {
  url: string;
  id: string;
};

class Listen<T> {
  value: T;
  listeners: { [key: string]: (v: T) => void } = {};

  constructor(initial: T) {
    this.value = initial;
  }

  call = <D>(fn: (v: T) => { v: T; r: D }) => {
    const { v, r } = fn(this.value);
    this.value = v;
    Object.keys(this.listeners).forEach((k) => this.listeners[k](this.value));
    return r;
  };

  change = (fn: (v: T) => T) => {
    this.call((v) => {
      return { v: fn(v), r: null };
    });
  };

  get = <D>(fn: (v: T) => D) => fn(this.value);

  addlistener = (fn: (v: T) => void, id?: string) => {
    const key = id || uuidv4();
    this.listeners[key] = fn;
    return key;
  };

  removelistener = (id: string) => {
    delete this.listeners[id];
  };
}

type botlistenables = {
  queue: qentry[];
  vc: VoiceConnection | null;
  dispatcher: StreamDispatcher | null;
};

type vidinfo = {
  title: string;
  duration: number;
};

const getvidinfo = (url: string) => {
  return new Promise<vidinfo>((res) => {
    ytdl.getInfo(url).then((v) => {
      res({
        title: v.videoDetails.title,
        duration: parseInt(v.videoDetails.lengthSeconds),
      });
    });
  });
};

class Bot {
  client: Client = new Client();
  prefix: string;

  mainid: string = "-1";

  mode: "queue" | "playlist" = "queue";

  listenables: Listen<botlistenables> = new Listen({
    queue: [],
    vc: null,
    dispatcher: null,
  } as botlistenables);

  queueinfocache: CacheMap<vidinfo> = new CacheMap(
    getvidinfo,
    path.join("data", "infos.cache.json")
  );

  addlistener = (id: string, fn: () => void) => {
    this.listenables.addlistener((v) => fn(), id);
  };

  removelistener = (id: string) => {
    this.listenables.removelistener(id);
  };

  commands: { [key: string]: (msg: Message) => Promise<void> } = {
    // TODO: help command

    // good command mmmmmmm yesssssss
    rub: async (msg) => {
      // <@id> are mentions
      msg.channel.send(`mmm yesssssss, <@${msg.author?.id}>`);
    },

    // set main id
    sm: async (msg) => {
      this.mainid = msg.channel.id;

      msg.channel.send(`Main id set to ${this.mainid}`);
    },

    // join a vc
    join: async (msg) => {
      // get vc channel id
      const channelid = msg.member?.voice.channelID;
      // check if author in a vc
      if (!channelid) {
        msg.channel.send("Please join a vc to use this command");
        return;
      }
      // get the channel
      const channel = this.client.channels.cache.get(channelid) as VoiceChannel;

      // join it
      channel
        .join()
        .then((c) => {
          // set voice state
          this.listenables.change((v) => {
            v.vc = c;
            return v;
          });
          // inform
          msg.channel.send(`Connected to ${channel.name}`);
        })
        .catch((e) => {
          // inform about error
          msg.channel.send("An error occurred");
          // log error
          console.error(e);
        });
    },

    // leave a vc
    leave: async (msg) => {
      this.listenables.change((v) => {
        // check if in vc
        if (v.vc) {
          // inform
          msg.channel.send(`Disconnected from ${v.vc.channel.name}`);
          // disconnect
          v.vc?.disconnect();
          v.vc = null;
          v.dispatcher = null;
        } else {
          msg.channel.send("Not in vc");
        }
        return v;
      });
    },
  };

  constructor(token: string, prefix: string) {
    // initialize the client
    this.prefix = prefix;

    // set activity to cbt
    this.client.on("ready", () => {
      this.client.user?.setActivity("CBT");
    });

    // msg reaction
    this.client.on("message", async (msg) => {
      // dont react on own messages
      if (msg.author === this.client.user) return;

      // check if command starts with prefix
      if (msg.content.startsWith(this.prefix)) {
        // get the name on command
        const command = msg.content.split(" ")[0].slice(this.prefix.length);
        // executing command from name
        this.commands[command](msg);
      }
    });

    // login
    this.client.login(token);
  }

  // send msg to main command
  sendmain = (msg: string) => {
    // check if mainid set after construction
    if (this.mainid === "-1") {
      return false;
    }
    // send message
    (this.client.channels.cache.get(this.mainid) as TextChannel).send(msg);
    // confirm sending to caller
    return true;
  };

  addurls = (urls: string[]) => {
    this.listenables.change((v) => {
      // add urls to queue and attach ids
      v.queue.push(
        ...urls.map((url) => {
          return {
            url,
            id: uuidv4(),
          };
        })
      );
      return v;
    });
  };

  remove = (id: string) => {
    return this.listenables.call((v) => {
      // filter the ones without id
      let found = false;
      v.queue = v.queue.filter((e) => {
        if (e.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return { v, r: found };
    });
  };

  // play queue
  playqueue = () => {
    return this.listenables.call((v) => {
      // return false if no queue
      if (v.queue.length === 0) {
        v.dispatcher = null;
        return { v, r: false };
      }
      // return true if already playing or on pause
      if (v.dispatcher) return { v, r: true };

      if (v.vc) {
        // playing the song
        v.dispatcher = v.vc.play(ytdl(v.queue[0].url));
        // recurse
        v.dispatcher.on("finish", () => {
          const el = v.queue.shift() as qentry;
          if (this.mode === "playlist") v.queue.push(el);
          v.dispatcher = null;
          this.playqueue();
        });
        // confirm
        return { v, r: true };
      }
      // no vc
      return { v, r: false };
    });
  };

  // skip
  skip = () => {
    return this.listenables.call((v) => {
      if (v.dispatcher) {
        v.dispatcher.end();
        return { v, r: true };
      }
      return { v, r: true };
    });
  };

  // play/pause
  p = () => {
    this.listenables.call((v) => {
      // return play attempt if not playing
      if (!v.dispatcher) {
        return { v, r: this.playqueue() };
      }
      // resume if paused, pause if not
      if (v.dispatcher.paused) {
        v.dispatcher.resume();
      } else {
        v.dispatcher.pause();
      }
      return { v, r: true };
    });
  };

  playstatus = (): "play" | "paused" | "notplaying" => {
    return this.listenables.get((v) => {
      if (!v.dispatcher) return "notplaying";
      if (v.dispatcher.paused) return "paused";
      else return "play";
    });
  };

  getchannel = () => {
    return this.listenables.get((v) => {
      return v.vc?.channel.name;
    });
  };

  getqueue = async () => {
    const queue = this.listenables.get((v) => v.queue);
    return Promise.all(
      queue.map(async ({ id, url }) => {
        return { id, url, info: await this.queueinfocache.get(url) };
      })
    );
  };

  getqueuecached = () => {
    const queue = this.listenables.get((v) => v.queue);
    return queue.map(({ id, url }) => {
      return {
        id,
        url,
        info: this.queueinfocache.getcached(url, { title: url, duration: 0 }),
      };
    });
  };

  setvolume = (volume: number) => {
    this.listenables.change((v) => {
      v.dispatcher?.setVolume(volume);
      return v;
    });
  };

  getvolume = () => {
    return this.listenables.get((v) => v.dispatcher?.volume);
  };
}

// export Bot
export default Bot;
