import { TYPES } from "../types/types.js";

const initState = {
  break: {
    name: "break",
    length: 5,
    minutes: 5,
    seconds: 60,
  },
  session: {
    name: "session",
    length: 25,
    minutes: 25,
    seconds: 60,
  },
  current: null,
  isRunning: false,
};

export const clockReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPES.breakLengthIncrement:
      return {
        ...state,
        break: {
          ...state.break,
          length: state.break.length + 1,
          minutes: state.break.minutes + 1,
        },
      };
    case TYPES.breakLengthDecrement:
      return {
        ...state,
        break: {
          ...state.break,
          length: state.break.length - 1,
          minutes: state.break.minutes - 1,
        },
      };
    case TYPES.sessionLengthIncrement:
      return {
        ...state,
        session: {
          ...state.session,
          minutes: state.session.minutes + 1,
          length: state.session.length + 1,
        },
      };
    case TYPES.sessionLengthDecrement:
      return {
        ...state,
        session: {
          ...state.session,
          length: state.session.length - 1,
          minutes: state.session.minutes - 1,
        },
      };
    case TYPES.timerToggleStartPause:
      return {
        ...state,
        isRunning: !state.isRunning,
      };
    case TYPES.timerUpdateCurrentTime:
      return {
        ...state,
        current: {
          ...state.current,
          ...action.payload,
        },
      };
    case TYPES.timerSetConfig:
      return {
        ...state,
        current: {
          ...action.payload,
        },
      };
    case TYPES.clockResetAllValues:
      return {
        ...initState,
        current: {
          ...initState.session,
        },
      };
    default:
      return state;
  }
};
