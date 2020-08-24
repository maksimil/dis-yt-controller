import { Client, Message, VoiceChannel } from "discord.js";
import State from "./state";

class Discord {
  client: Client = new Client();

  commands: { [key: string]: (msg: Message) => void };

  constructor(stateref: State, token: string, prefix: string) {
    this.commands = {
      // TODO: help command
      rub: (msg) => {
        msg.channel.send(`mmm yesssssss, <@${msg.author?.id}>`);
      },

      join: (msg) => {
        const channelid = msg.member?.voice.channelID;
        if (!channelid) {
          msg.channel.send("Please join a vc to use this command");
          return;
        }
        const channel = this.client.channels.cache.get(
          channelid
        ) as VoiceChannel;

        channel
          .join()
          .then((c) => {
            stateref.change((state) => {
              state.vc = c;
              return state;
            });
            msg.channel.send(`Connected to ${channel.name}`);
          })
          .catch((e) => {
            msg.channel.send("An error occurred");
            console.error(e);
          });
      },

      leave: (msg) => {
        stateref.change((state) => {
          if (state.vc) {
            msg.channel.send(`Disconnected from ${state.vc.channel.name}`);

            state.vc?.disconnect();
            state.vc = undefined;
            state.dispatcher = undefined;
          } else {
            msg.channel.send("Not in vc");
          }
          return state;
        });
      },
    };

    this.client.on("message", (msg) => {
      if (msg.author === this.client.user) return;

      if (msg.content.startsWith(prefix)) {
        const command = msg.content.split(" ")[0].slice(prefix.length);
        const fun = this.commands[command];

        if (!fun) {
          msg.channel.send(`Command ${command} not found`);
          return;
        }

        fun(msg);
      }
    });

    this.client.login(token);
  }
}

export default Discord;
