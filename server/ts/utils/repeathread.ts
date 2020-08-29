type repeathread = {
  fn: (thread: repeathread) => void;
  running: boolean;
  period: number;
};

export const run = (thread: repeathread) => {
  if (thread.running) {
    thread.fn(thread);

    setTimeout(() => {
      run(thread);
    }, thread.period);
  }
};

export const create = (fn: (thread: repeathread) => void) => {
  const thread = { fn, running: true } as repeathread;
  run(thread);
  return thread;
};
