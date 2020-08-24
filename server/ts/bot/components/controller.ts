import ytdl, { validateURL } from "ytdl-core";
import State from "./state";
import { v4 as uuidv4 } from "uuid";

type Controller = {
  play: () => boolean;
  enqueue: (url: string) => boolean;
  remove: (id: string) => boolean;
  p: () => void;
  skip: () => boolean;
};

const Controller = (stateref: State) => {
  const play = () => {
    return stateref.call((state) => {
      if (state.queue.length() === 0) return { state, r: false };

      if (state.dispatcher) return { state, r: true };

      if (state.vc) {
        state.dispatcher = state.vc.play(ytdl(state.queue.getnext().url));

        state.dispatcher.on("finish", () => {
          state.queue.shift(false);
          state.dispatcher = undefined;
          play();
        });

        return { state, r: true };
      }

      return { state, r: false };
    });
  };

  const enqueue = (url: string) => {
    if (!validateURL(url)) return false;
    stateref.change((state) => {
      state.queue.enqueue({
        url,
        id: uuidv4(),
      });
      return state;
    });
    return true;
  };

  const remove = (id: string) => {
    return stateref.call((state) => {
      const r = state.queue.removeuniqueue((v) => v.id === id);
      return { state, r };
    });
  };

  const p = () => {
    return stateref.call((state) => {
      if (!state.dispatcher) return { state, r: play() };

      if (state.dispatcher.paused) {
        state.dispatcher.resume();
      } else {
        state.dispatcher.pause();
      }
      return { state, r: true };
    });
  };

  const skip = () => {
    return stateref.call((state) => {
      if (state.dispatcher) {
        state.dispatcher.end();
        return { state, r: true };
      }
      return { state, r: false };
    });
  };

  return { play, enqueue, remove, p, skip } as Controller;
};

export default Controller;
