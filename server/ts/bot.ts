import { Client, Message, TextChannel } from "discord.js";

class Bot {
  client: Client;
  prefix: string;
  mainid: string;

  commands: { [key: string]: (msg: Message) => Promise<void> } = {
    // TODO: help command
    rub: async (msg) => {
      msg.channel.send(`mmm yesssssss, <@${msg.author?.id}>`);
    },
    sm: async (msg) => {
      this.mainid = msg.channel.id;

      msg.channel.send(`Main id set to ${this.mainid}`);
    },
  };

  constructor(token: string, prefix: string) {
    // initialize the client
    this.client = new Client();
    this.prefix = prefix;
    this.mainid = "-1";

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
}

// export Bot
export default Bot;
