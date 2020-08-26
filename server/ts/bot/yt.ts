import { VidInfo } from "../bot";
import { getInfo } from "ytdl-core";

const getvidinfo = async (url: string) => {
  const info = await getInfo(url);
  return {
    title: info.videoDetails.title,
    duration: parseInt(info.videoDetails.lengthSeconds),
  } as VidInfo;
};

export const getinfocached = (cache: smap<VidInfo>, url: string) =>
  cache[url] || { title: url, duration: 0 };

export const getinfo = async (cache: smap<VidInfo>, url: string) => {
  if (cache[url]) return cache[url];

  cache[url] = await getvidinfo(url);
  return cache[url];
};
