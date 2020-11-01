export const getParsedTime = (minutes, seconds) => {
  const min = (minutes + "").length === 2 ? minutes : `0${minutes}`;
  const sec =
    (seconds + "").length === 2
      ? seconds === 60
        ? "00"
        : seconds
      : `0${seconds}`;
  return `${min}:${sec}`;
};
