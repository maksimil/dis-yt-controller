const tts = (s: number) => {
  if (s > 3600) {
    const sah = s % 3600;
    return `${(s / 3600) >> 0}:${(sah / 60) >> 0}:${sah % 60}`;
  }
  if (s > 60) {
    return `${(s / 60) >> 0}:${s % 60}`;
  }
  return `${s}`;
};

export default tts;
