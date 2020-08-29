export const callrepeat = (
  fn: () => void,
  duration: number,
  period: number
) => {
  fn();

  if (duration > 0) {
    setTimeout(() => {
      callrepeat(fn, duration - period, period);
    }, period);
  }
};
