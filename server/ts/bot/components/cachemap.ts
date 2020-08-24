import { readFileSync, writeFileSync } from "fs";

class CacheMap<T> {
  cache: { [key: string]: T } = {};
  fn: (v: string) => Promise<T>;
  path: string | undefined;

  constructor(fn: (v: string) => Promise<T>, path?: string) {
    this.fn = fn;
    this.path = path;
    this.load();
  }

  load = (path?: string) => {
    const p = path || this.path;
    if (p) {
      this.cache = JSON.parse(readFileSync(p, { encoding: "utf8" }));
    }
  };

  save = (path?: string) => {
    const p = path || this.path;
    if (p) {
      writeFileSync(p, JSON.stringify(this.cache));
    }
  };

  get = async (v: string) => {
    if (this.cache[v]) return this.cache[v];

    const value = await this.fn(v);
    this.cache[v] = value;
    this.save();
    return value;
  };

  getcache = (v: string, def: T) => {
    return this.cache[v] || def;
  };

  invertcache = (inverter: (v: T) => string) => {
    let invertedcache: { [key: string]: string } = {};
    Object.keys(this.cache).forEach((k) => {
      invertedcache[inverter(this.cache[k])] = k;
    });
    return invertedcache;
  };
}

export default CacheMap;
