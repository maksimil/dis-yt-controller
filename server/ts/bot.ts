import { Client, Message } from "discord.js";

// get configs
class Bot {
  client: Client;
  prefix: string;

  commands: { [key: string]: (msg: Message) => Promise<void> } = {
    rub: async (msg) => {
      msg.channel.send(`mmm yesssssss, <@${msg.author?.id}>`);
    },
  };

  constructor(token: string, prefix: string) {
    // initialize the client
    this.client = new Client();
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
}

// export Bot
export default Bot;
