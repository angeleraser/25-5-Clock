import { TYPES } from "../types/types.js";

export const incrementBreakLength = () => ({
  type: TYPES.breakLengthIncrement,
});

export const decrementBreakLength = () => ({
  type: TYPES.breakLengthDecrement,
});

export const incrementSessionLength = () => ({
  type: TYPES.sessionLengthIncrement,
});

export const decrementSessionLength = () => ({
  type: TYPES.sessionLengthDecrement,
});

export const toggleTimerStartPause = () => {
  return {
    type: TYPES.timerToggleStartPause,
  };
};

export const timerSetMinutes = (minutes) => {
  return {
    type: TYPES.timerSetMinutes,
    payload: minutes,
  };
};

export const timerSetConfig = (current) => {
  return {
    type: TYPES.timerSetConfig,
    payload: current,
  };
};

export const timerUpdateCurrentTime = (minutes, seconds, length) => {
  return {
    type: TYPES.timerUpdateCurrentTime,
    payload: {
      minutes,
      seconds,
      length,
    },
  };
};

export const resetClockTimer = () => {
  return {
    type: TYPES.clockResetAllValues,
  };
};
