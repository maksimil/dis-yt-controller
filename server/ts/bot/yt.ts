import { VidInfo } from "../bot";
import { getInfo } from "ytdl-core";
import { loadobject } from "../utils/load";
import { join } from "path";
import { writeFileSync } from "fs";

const cachepath = join("data", "infos.cache.json");

export const loadcache = (): smap<VidInfo> => loadobject(cachepath, {});

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

  writeFileSync(cachepath, JSON.stringify(cache));

  return cache[url];
};

export const getturlcache = (cache: smap<VidInfo>) => {
  let turlcache: smap<string> = {};
  Object.keys(cache).forEach((url) => {
    turlcache[cache[url].title] = url;
  });
  return turlcache;
};
