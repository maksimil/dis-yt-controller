import { BotState } from "../bot";
import ytdl, { validateURL } from "ytdl-core";
import { callafter } from "./listen";
import { v4 } from "uuid";

export const play = (state: BotState) =>
  callafter(state.listener, () => {
    if (state.queue.length === 0) return false;

    if (state.dispatcher) return true;

    if (state.vc) {
      state.dispatcher = state.vc.play(ytdl(state.queue[0].url));

      state.dispatcher.on("finish", () => {
        state.queue.shift();
        state.dispatcher = undefined;
        play(state);
      });

      return true;
    }

    return false;
  });

export const enqueue = (state: BotState, url: string) =>
  callafter(state.listener, () => {
    if (!validateURL(url)) return false;
    state.queue.push({ url, id: v4() });
    return true;
  });

export const remove = (state: BotState, id: string) =>
  callafter(state.listener, () => {
    state.queue = state.queue.filter((e) => e.id !== id);
  });

export const p = (state: BotState) =>
  callafter(state.listener, () => {
    if (!state.dispatcher) return play(state);

    if (state.dispatcher.paused) {
      state.dispatcher.resume();
    } else {
      state.dispatcher.pause();
    }
    return true;
  });

export const skip = (state: BotState) =>
  callafter(state.listener, () => {
    if (state.dispatcher) {
      state.dispatcher.end();
      return true;
    }
    return false;
  });

export const setvolume = (state: BotState, v: number) =>
  callafter(state.listener, () => {
    state.dispatcher?.setVolume(v);
  });
