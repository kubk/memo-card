export const formatTime = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const generateTimeRange = () => {
  const options: string[] = [];
  const MINUTE_STEP = 30;

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += MINUTE_STEP) {
      options.push(formatTime(i, j));
    }
  }

  return options;
};
