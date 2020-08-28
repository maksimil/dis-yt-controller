import { loadobject } from "./load";
import { join } from "path";
import { QueueEntry } from "../bot";
import { v4 } from "uuid";
import { writeFileSync } from "fs";

const metapath = join("data", "playlist", "meta.json");
export const ppath = (name: string) =>
  join("data", "playlist", `_${name}_.json`);

export const loadmeta = (): string[] => loadobject(metapath, []);

export const loadplaylist = (name: string): QueueEntry[] =>
  loadobject<string[]>(ppath(name), []).map((url) => ({ url, id: v4() }));

export const saveplaylist = (
  meta: string[],
  name: string,
  queue: QueueEntry[]
) => {
  let exists = false;
  meta.forEach((e) => {
    exists = exists || e === name;
  });

  if (!exists) {
    meta.push(name);
  }

  writeFileSync(
    ppath(name),
    JSON.stringify(queue.map((element) => element.url))
  );
  writeFileSync(metapath, JSON.stringify(meta));
};
