import {
  resetClockTimer,
  timerSetConfig,
  timerUpdateCurrentTime,
  toggleTimerStartPause,
} from "../actions/controller.js";
import { dispatch, getState } from "../store/store.js";
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
          this.removeStyles();
        } else {
          this.initializeInterval();
        }
        dispatch(toggleTimerStartPause());
      });
      resetBtn.addEventListener("click", () => {
        clearInterval(interval);
        dispatch(resetClockTimer());
        this.updateHeader("Session");
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
