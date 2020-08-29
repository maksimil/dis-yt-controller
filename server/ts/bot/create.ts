import { Client, Message, VoiceChannel } from "discord.js";
import { callafter } from "./listen";
import { BotState } from "../bot";
import { loadcache } from "./yt";

export const createbot = (token: string, prefix: string) => {
  let state = {
    client: new Client(),
    listener: () => {},
    vc: undefined,
    dispatcher: undefined,
    queue: [],
    cache: loadcache(),
    volume: 1,
  } as BotState;

  const commands: smap<(msg: Message) => void> = {
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
      const channel = state.client.channels.cache.get(
        channelid
      ) as VoiceChannel;

      channel
        .join()
        .then((c) => {
          callafter(state.listener, () => {
            state.vc = c;
          });

          msg.channel.send(`Connected to ${channel.name}`);
        })
        .catch((e) => {
          msg.channel.send("An error occurred");
          console.error(e);
        });
    },

    leave: (msg) => {
      callafter(state.listener, () => {
        if (state.vc) {
          msg.channel.send(`Disconnected from ${state.vc.channel.name}`);

          state.vc?.disconnect();
          state.vc = undefined;
          state.dispatcher = undefined;
        } else {
          msg.channel.send("Not in vc");
        }
      });
    },
  };

  state.client.on("message", (msg) => {
    if (msg.author === state.client.user) return;

    if (msg.content.startsWith(prefix)) {
      const command = msg.content.split(" ")[0].slice(prefix.length);
      const fun = commands[command];

      if (!fun) {
        msg.channel.send(`Command ${command} not found`);
        return;
      }

      fun(msg);
    }
  });

  state.client.login(token);

  return state;
};
