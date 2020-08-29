import { Client, VoiceConnection, StreamDispatcher } from "discord.js";

type QueueEntry = {
  url: string;
  id: string;
};

type VidInfo = {
  title: string;
  duration: number;
};

type BotState = {
  client: Client;

  vc: VoiceConnection | undefined;
  dispatcher: StreamDispatcher | undefined;
  queue: QueueEntry[];

  volume: number;

  cache: smap<VidInfo>;

  listener: () => void;
};
