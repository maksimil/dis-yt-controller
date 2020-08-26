import {
  Client,
  Message,
  VoiceChannel,
  VoiceConnection,
  StreamDispatcher,
} from "discord.js";
import { BotState, VidInfo } from "../bot";
import { loadobject } from "./load";
import { join } from "path";

export const createbot = (token: string, prefix: string) => {
  let client = new Client();

  let listener = () => {};

  let vc: VoiceConnection | undefined = undefined;
  let dispatcher: StreamDispatcher | undefined = undefined;

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
      const channel = client.channels.cache.get(channelid) as VoiceChannel;

      channel
        .join()
        .then((c) => {
          vc = c;
          listener();

          msg.channel.send(`Connected to ${channel.name}`);
        })
        .catch((e) => {
          msg.channel.send("An error occurred");
          console.error(e);
        });
    },

    leave: (msg) => {
      if (vc) {
        msg.channel.send(`Disconnected from ${vc.channel.name}`);

        vc?.disconnect();
        vc = undefined;
        dispatcher = undefined;
      } else {
        msg.channel.send("Not in vc");
      }

      listener();
    },
  };
  client.on("message", (msg) => {
    if (msg.author === client.user) return;

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

  return {
    client,
    vc,
    dispatcher,
    queue: [],
    cache: loadobject<smap<VidInfo>>(join("data", "infos.cache.json"), {}),
    listener,
  } as BotState;
};
