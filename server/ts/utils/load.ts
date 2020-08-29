import { existsSync, readFileSync, writeFileSync } from "fs";

export const loadobject = <T>(path: string, def: T, create: boolean = true) => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, { encoding: "utf8" })) as T;
  } else {
    if (create) writeFileSync(path, JSON.stringify(def));
    return def;
  }
};
