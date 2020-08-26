export const callafter = <T>(after: () => void, main: () => T) => {
  const res = main();
  after();
  return res;
};
