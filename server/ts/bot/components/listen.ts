import { v4 as uuidv4 } from "uuid";

class Listen<T> {
  state: T;
  listeners: { [id: string]: (state: T) => void } = {};

  constructor(state: T) {
    this.state = state;
  }

  addlistener = (fn: (state: T) => void, id?: string) => {
    const iid = id || uuidv4();
    this.listeners[iid] = fn;
    return iid;
  };

  removelistener = (id: string) => {
    if (this.listeners[id]) {
      delete this.listeners[id];
      return true;
    }
    return false;
  };

  calllisteners = () => {
    Object.keys(this.listeners).forEach((k) => {
      this.listeners[k](this.state);
    });
  };

  call = <D>(fn: (state: T) => { state: T; r: D }) => {
    const { state, r } = fn(this.state);
    this.state = state;
    this.calllisteners();
    return r;
  };

  change = (fn: (state: T) => T) => {
    this.call((state) => {
      return { state: fn(state), r: null };
    });
  };

  get = <D>(fn: (state: T) => D) => {
    return fn(this.state);
  };
}

export default Listen;
