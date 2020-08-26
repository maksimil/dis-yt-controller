import { Client, VoiceConnection } from "discord.js";

type QueueEntry = {
  url: string;
  id: string;
};

type VidInfo = {
  title: string;
  duration: number;
};

type Listenable<T> = {
  v: T;
  listener: (v: T) => void;
};

type BotState = {
  client: Client;

  vc: VoiceConnection | undefined;
  dispatcher: StreamDispatcher | undefined;
  queue: QueueEntry[];

  cache: { [url: string]: VidInfo };

  listener: () => void;
};
