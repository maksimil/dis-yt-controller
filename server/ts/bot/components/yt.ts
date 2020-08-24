import { getInfo } from "ytdl-core";
import CacheMap from "./cachemap";
import { join } from "path";

const getvinfo = async (url: string) => {
  const info = await getInfo(url);
  return {
    title: info.videoDetails.title,
    duration: parseInt(info.videoDetails.lengthSeconds),
  } as vinfo;
};

class Yt {
  cache: CacheMap<vinfo> = new CacheMap(
    getvinfo,
    join("data", "infos.cache.json")
  );

  get = this.cache.get;

  getcache = (url: string) => {
    return this.cache.getcache(url, { title: url, duration: 0 });
  };

  getturlcache = () => {
    return this.cache.invertcache((info) => info.title);
  };
}

export default Yt;
