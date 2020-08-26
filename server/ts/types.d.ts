type smap<T> = { [key: string]: T };

type updatequentry = {
  id: string;
  url: string;
  info: vinfo;
};

type updatedata = {
  channel: string | undefined;
  queue: updatequentry[];
  pstatus: "play" | "paused" | "notplaying";
  volume: number | undefined;
  turlcache: { [key: string]: string };
};

declare module "*.json" {
  const value: any;
  export default value;
}
