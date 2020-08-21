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

type qentry = {
  url: string;
  id: string;
};

class Bot {
  client: Client = new Client();
  prefix: string;

  mainid: string = "-1";

  mode: "queue" | "playlist" = "queue";
  dispatcher: StreamDispatcher | null = null;
  vc: VoiceConnection | null = null;
  queue: qentry[] = [];

  listeners: { [key: string]: () => void } = {};

  calllisteners = () => {
    Object.keys(this.listeners).forEach((k) => this.listeners[k]());
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
          this.vc = c;
          // inform
          msg.channel.send(`Connected to ${channel.name}`);
          // listeners
          this.calllisteners();
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
      // check if in vc
      if (this.vc) {
        // inform
        msg.channel.send(`Disconnected from ${this.vc.channel.name}`);
        // disconnect
        this.vc?.disconnect();
        this.vc = null;
        this.dispatcher = null;
        // listeners
        this.calllisteners();
      } else {
        msg.channel.send("Not in vc");
      }
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
    // add urls to queue and attach ids
    this.queue.push(
      ...urls.map((url) => {
        return {
          url,
          id: uuidv4(),
        };
      })
    );
    // listeners
    this.calllisteners();
  };

  remove = (id: string) => {
    // filter the ones without id
    let found = false;
    this.queue = this.queue.filter((e) => {
      if (e.id === id) {
        found = true;
        return false;
      }
      return true;
    });
    this.calllisteners();
    return found;
  };

  // play queue
  playqueue = () => {
    // return false if no queue
    if (this.queue.length === 0) {
      this.dispatcher = null;
      this.calllisteners();
      return false;
    }
    // return true if already playing or on pause
    if (this.dispatcher) return true;

    if (this.vc) {
      // playing the song
      this.dispatcher = this.vc.play(ytdl(this.queue[0].url));
      // recurse
      this.dispatcher.on("finish", () => {
        const el = this.queue.shift() as qentry;
        if (this.mode === "playlist") this.queue.push(el);
        this.calllisteners();
        this.dispatcher = null;
        this.playqueue();
      });
      // confirm
      return true;
    }
    // no vc
    return false;
  };

  // skip
  skip = () => {
    if (this.dispatcher) {
      this.dispatcher.end();
      this.calllisteners();
      return true;
    }
    return false;
  };

  // play/pause
  p = () => {
    // return play attempt if not playing
    if (!this.dispatcher) {
      return this.playqueue();
    }
    // resume if paused, pause if not
    if (this.dispatcher.paused) {
      this.dispatcher.resume();
    } else {
      this.dispatcher.pause();
    }
    this.calllisteners();
    return true;
  };

  playstatus = (): "play" | "paused" | "notplaying" => {
    if (!this.dispatcher) return "notplaying";
    if (this.dispatcher.paused) return "paused";
    else return "play";
  };

  getchannel = () => {
    return this.vc?.channel.name;
  };
}

// export Bot
export default Bot;
