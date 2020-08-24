type quentry = {
  url: string;
  id: string;
};

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

type vinfo = {
  title: string;
  duration: number;
};

declare module "*.json" {
  const value: any;
  export default value;
}
