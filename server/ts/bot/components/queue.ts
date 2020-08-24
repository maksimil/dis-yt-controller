class Queue<T> {
  queue: T[];

  constructor(queue?: T[]) {
    this.queue = queue || [];
  }

  enqueue = (element: T) => {
    this.queue.push(element);
  };

  getnext = () => this.queue[0];

  shift = (loop: boolean) => {
    const element = this.queue.shift();
    if (!element) return undefined;
    if (loop) this.enqueue(element);
    return element;
  };

  removeuniqueue = (fn: (v: T) => boolean) => {
    const index = this.queue.findIndex(fn);
    if (index === -1) return false;

    this.queue = this.queue.splice(index, 1);
    return true;
  };

  filter = (fn: (v: T) => boolean) => {
    this.queue = this.queue.filter(fn);
  };

  length = () => this.queue.length;
}

export default Queue;
