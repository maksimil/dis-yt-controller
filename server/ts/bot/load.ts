import { existsSync, readFileSync, writeFileSync } from "fs";

export const loadobject = <T>(path: string, def: T) => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, { encoding: "utf8" })) as T;
  } else {
    writeFileSync(path, JSON.stringify(def));
    return def;
  }
};
