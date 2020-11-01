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
const breakLengthControllerHTML = document.querySelector(
  "#break-length-controller"
);

const sessionLengthControllerHTML = document.querySelector(
  "#session-length-controller"
);

const LengthController = (controllerHTML, controllerName) => {
  const incrementBtn = controllerHTML.querySelector(".increment");
  const decrementBtn = controllerHTML.querySelector(".decrement");
  const lengthCount = controllerHTML.querySelector("h2");
  return {
    addClickEventListener({ increment, decrement }) {
      incrementBtn.addEventListener("click", () => {
        if (!getState().clock.isRunning) {
          if (getState().clock[`${controllerName}`].length < 60) {
            increment();
            this.updateCurrentConfig();
          }
        }
      });
      decrementBtn.addEventListener("click", () => {
        if (!getState().clock.isRunning) {
          if (getState().clock[`${controllerName}`].length > 1) {
            decrement();
            this.updateCurrentConfig();
          }
        }
      });
    },
    updateLength(newVal) {
      lengthCount.textContent = newVal;
    },
    updateCurrentConfig() {
      if (getState().clock.current.name === controllerName) {
        dispatch(
          timerUpdateCurrentTime(
            getState().clock[`${controllerName}`].minutes,
            getState().clock[`${controllerName}`].seconds,
            getState().clock[`${controllerName}`].length
          )
        );
      }
    },
  };
};

export const breakLengthController = LengthController(
  breakLengthControllerHTML,
  "break"
);

export const sessionLengthController = LengthController(
  sessionLengthControllerHTML,
  "session"
);
const timerHTML = document.querySelector("#timer");
let interval = null;
const Timer = (timerHTML) => {
  const headerHtml = timerHTML.querySelector("header"),
    timeLeftHTML = timerHTML.querySelector(".time-left"),
    startPauseBtn = timerHTML.querySelector(".start-stop"),
    beepAudio = timerHTML.querySelector("#beep"),
    resetBtn = timerHTML.querySelector(".reset");
  return {
    update(newVal) {
      timeLeftHTML.textContent = newVal;
    },
    updateHeader(newVal) {
      headerHtml.textContent = newVal;
    },
    addClickEventListener() {
      startPauseBtn.addEventListener("click", () => {
        if (getState().clock.isRunning) {
          clearInterval(interval);
        } else {
          this.initializeInterval();
        }
        dispatch(toggleTimerStartPause());
      });
      resetBtn.addEventListener("click", () => {
        clearInterval(interval);
        this.updateHeader("Session");
        dispatch(resetClockTimer());
        beepAudio.pause();
        beepAudio.currentTime = 0;
      });
    },
    initializeInterval() {
      interval = setInterval(() => {
        if (getState().clock.isRunning) {
          const clock = getState().clock;
          let { minutes, seconds, name, length } = clock.current;
          if (minutes === 0 && seconds === 0) {
            switch (name) {
              case "break":
                this.updateHeader("Session");
                break;
              case "session":
                this.updateHeader("Break");
                break;
              default:
                break;
            }
            const sessionConfig = clock.session;
            this.playBeepSound();
            if (name === sessionConfig.name) {
              const breakConfig = clock.break;
              dispatch(timerSetConfig({ ...breakConfig }));
              minutes = breakConfig.minutes;
              seconds = breakConfig.seconds;
              length = breakConfig.length;
            } else {
              dispatch(timerSetConfig({ ...sessionConfig }));
              minutes = sessionConfig.minutes;
              seconds = sessionConfig.seconds;
              length = sessionConfig.length;
            }
          } else {
            if (minutes > 0 && seconds === 60) minutes -= 1;
            if (seconds > 0) {
              seconds -= 1;
            } else {
              seconds = 60;
            }
            dispatch(timerUpdateCurrentTime(minutes, seconds, length));
          }
        }
      }, 1e3);
    },
    playBeepSound() {
      beepAudio.currentTime = 0;
      beepAudio.play();
    },
  };
};

export const ClockTimer = Timer(timerHTML);
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

export const TYPES = {
  sessionLengthIncrement: "[Clock] Session length increment",
  sessionLengthDecrement: "[Clock] Session length decrement",
  breakLengthDecrement: "[Clock] Break length decrement",
  breakLengthIncrement: "[Clock] Break length increment",
  clockResetAllValues: "[Clock] Reset all values",
  timerUpdateMinutes: "[Clock] Timer update minutes",
  timerUpdateCurrentTime: "[Clock] Timer upadte current time",
  timerSetConfig: "[Clock] Timer Set config",
  timerToggleStartPause: "[Clock] Timer toggle start/pause",
  timerUpdateSeconds: "[Clock] Timer update seconds",
};
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
const { createStore, combineReducers } = Redux;
const store = createStore(
  combineReducers({
    clock: clockReducer,
  })
);
export const { subscribe: onUpdateStore, getState, dispatch } = store;
const render = () => {
  const clock = getState().clock;
  sessionLengthController.updateLength(clock.session.length);
  breakLengthController.updateLength(clock.break.length);
  const { minutes, seconds, name } = clock.current;
  if (minutes === 0 && seconds === 0) {
    ClockTimer.update(getParsedTime(0, 0));
  } else {
    ClockTimer.update(getParsedTime(minutes, seconds));
  }
  console.log(name, getParsedTime(minutes, seconds));
};
onUpdateStore(render);
dispatch(timerSetConfig({ ...getState().clock.session }));
ClockTimer.addClickEventListener();
sessionLengthController.addClickEventListener({
  increment() {
    dispatch(incrementSessionLength());
  },
  decrement() {
    dispatch(decrementSessionLength());
  },
});
breakLengthController.addClickEventListener({
  increment() {
    dispatch(incrementBreakLength());
  },
  decrement() {
    dispatch(decrementBreakLength());
  },
});
