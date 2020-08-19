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
  client: Client;
  prefix: string;

  mainid: string;

  mode: "queue" | "playlist";
  dispatcher: StreamDispatcher | null;
  vc: VoiceConnection | null;
  queue: qentry[];

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
      } else {
        msg.channel.send("Not in vc");
      }
    },
  };

  constructor(token: string, prefix: string) {
    // initialize the client
    this.client = new Client();
    this.prefix = prefix;
    this.mainid = "-1";
    this.vc = null;
    this.queue = [];
    this.dispatcher = null;
    this.mode = "queue";

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

  addurl = (url: string) => {
    this.queue.push({
      url,
      id: uuidv4(),
    });
  };

  // play queue
  playqueue = () => {
    // return false if no queue
    if (this.queue.length === 0) {
      console.log("No queue");
      this.dispatcher = null;
      return false;
    }
    // return true if already playing
    if (this.dispatcher) return true;

    if (this.vc) {
      // getting the url
      const el = this.queue.shift() as qentry;
      // adding url to the end if in playlist
      if (this.mode === "playlist") this.queue.push(el);
      // playing the song
      this.dispatcher = this.vc.play(ytdl(el.url));
      // recurse
      this.dispatcher.on("finish", () => {
        console.log(this.queue);
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
    }
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
    return true;
  };
}

// export Bot
export default Bot;
