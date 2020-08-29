type repeathread = {
  fn: (thread: repeathread) => void;
  running: boolean;
  period: number;
};

export const runthread = (thread: repeathread) => {
  if (thread.running) {
    thread.fn(thread);

    setTimeout(() => {
      runthread(thread);
    }, thread.period);
  }
};

export const createthread = (
  fn: (thread: repeathread) => void,
  period: number
) => {
  const thread = { fn, running: true, period } as repeathread;
  runthread(thread);
  return thread;
};
