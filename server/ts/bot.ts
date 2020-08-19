import {
  Client,
  Message,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  StreamDispatcher,
} from "discord.js";
import ytdl from "ytdl-core";

class Bot {
  client: Client;
  prefix: string;

  mainid: string;

  mode: "queue" | "playlist";
  dispatcher: StreamDispatcher | null;
  vc: VoiceConnection | null;
  queue: string[];

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

  // play song from url, skips current song, can be executed only in queue mode
  playurl = (url: string) => {
    // check if in queue mode
    if (this.mode !== "queue") return false;
    // check if in vc
    if (!this.vc) return false;
    // skip current song
    if (this.dispatcher) {
      this.dispatcher.end();
      this.dispatcher = null;
    }

    // add url to the queue
    this.addtoqueue([url]);

    // confirm
    return true;
  };

  // add url to the queue, play if not playing anithing now
  addtoqueue = (urls: string[]) => {
    // add queue
    this.queue.push(...urls);

    // play if not playing
    if (!this.dispatcher) {
      // return if not in vc
      if (!this.vc) {
        return;
      }
      // play if is in vc
      this.playqueue();
    }
  };

  // play queue
  playqueue = () => {
    // return false if no queue
    if (this.queue.length === 0) return false;
    if (this.vc) {
      // getting the url
      const url = this.queue.shift() as string;
      // adding url to the end if in playlist
      if (this.mode === "playlist") this.queue.push(url);
      // playing the song
      this.dispatcher = this.vc.play(ytdl(url));
      // recurse
      this.dispatcher.on("finish", () => {
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
      this.dispatcher = null;
      this.playqueue();
    }
  };
}

// export Bot
export default Bot;
