import { BotState } from "../bot";
import { getinfo, getinfocached, getturlcache } from "./yt";

const getqueue = (state: BotState) =>
  Promise.all(
    state.queue.map(async ({ id, url }) => {
      return {
        id,
        url,
        info: await getinfo(state.cache, url),
      } as updatequentry;
    })
  );

const getqueuecached = (state: BotState) =>
  state.queue.map(({ id, url }) => {
    return { id, url, info: getinfocached(state.cache, url) } as updatequentry;
  });

const getchannel = (state: BotState) => state.vc?.channel.name;

const getplaystatus = (state: BotState): "play" | "paused" | "notplaying" => {
  if (!state.dispatcher) return "notplaying";
  if (state.dispatcher.paused) return "paused";
  else return "play";
};

const getvolume = (state: BotState) => state.dispatcher?.volume;

export const getupdatedata = async (state: BotState) => {
  return {
    queue: await getqueue(state),
    channel: getchannel(state),
    pstatus: getplaystatus(state),
    volume: getvolume(state),
    turlcache: getturlcache(state.cache),
  } as updatedata;
};

export const getcachedupdatedata = (state: BotState) => {
  return {
    queue: getqueuecached(state),
    channel: getchannel(state),
    pstatus: getplaystatus(state),
    volume: getvolume(state),
    turlcache: getturlcache(state.cache),
  } as updatedata;
};
