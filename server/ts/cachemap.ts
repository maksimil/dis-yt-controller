import fs from "fs";

class CacheMap<D> {
  fn: (v: string) => Promise<D>;
  cache: { [key: string]: D } = {};
  path: string;

  constructor(fn: (v: string) => Promise<D>, path: string) {
    this.fn = fn;
    this.path = path;
    this.load(path);
  }

  get = async (v: string) => {
    if (this.cache[v]) return this.cache[v];
    this.cache[v] = await this.fn(v);
    this.save();
    return this.cache[v];
  };

  load = (path: string) => {
    if (fs.existsSync(path))
      this.cache = JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
    this.save(path);
  };

  save = (path?: string) => {
    fs.writeFile(path || this.path, JSON.stringify(this.cache), () => {});
  };
}

export default CacheMap;
