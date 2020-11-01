import {
  resetClockTimer,
  timerSetConfig,
  timerUpdateCurrentTime,
  toggleTimerStartPause,
} from "../actions/controller.js";
import { dispatch, getState } from "../store/store.js";
import {
  breakLengthController,
  sessionLengthController,
} from "./LengthController.js";
const timerHTML = document.querySelector("#timer");
const headerHtml = timerHTML.querySelector("header"),
  timeLeftHTML = timerHTML.querySelector(".time-left"),
  startPauseBtn = timerHTML.querySelector(".start-stop"),
  beepAudio = timerHTML.querySelector("#beep"),
  resetBtn = timerHTML.querySelector(".reset");
let interval = null;
export const ClockTimer = {
  updateTimeLeft(newVal) {
    timeLeftHTML.textContent = newVal;
  },
  addWarningStyles() {
    timeLeftHTML.classList.add("one-minute-left-time");
  },
  removeWarningStyles() {
    timeLeftHTML.classList.remove("one-minute-left-time");
  },
  updateName(newVal) {
    headerHtml.textContent = newVal;
  },
  addClickEventListener() {
    startPauseBtn.addEventListener("click", () => {
      const { isRunning } = getState().clock;
      if (isRunning) {
        clearInterval(interval);
        breakLengthController.enableButtons();
        sessionLengthController.enableButtons();
      } else {
        this.initializeInterval();
        breakLengthController.disableButtons();
        sessionLengthController.disableButtons();
      }
      dispatch(toggleTimerStartPause());
      this.removeWarningStyles();
    });
    resetBtn.addEventListener("click", () => {
      clearInterval(interval);
      this.removeWarningStyles();
      dispatch(resetClockTimer());
      this.updateName("Session");
      beepAudio.pause();
      beepAudio.currentTime = 0;
    });
  },
  initializeInterval() {
    interval = setInterval(() => {
      const clock = getState().clock;
      if (clock.isRunning) {
        let { minutes: min, seconds: sec, name, length } = clock.current;
        if (min === 0 && sec === 0) {
          this.playBeepSound();
          if (name === "session") {
            this.reinitializeConfig({ config: clock.break, name: "Break" }, [
              min,
              sec,
              length,
            ]);
          } else {
            this.reinitializeConfig(
              { config: clock.session, name: "Session" },
              [min, sec, length]
            );
          }
        } else {
          if (min > 0 && sec === 60) min -= 1;
          if (sec > 0) {
            sec -= 1;
          } else {
            sec = 60;
          }
          if (min === 0) {
            this.addWarningStyles();
          }
          dispatch(timerUpdateCurrentTime(min, sec, length));
        }
      }
      console.log(clock);
    }, 1e3);
  },
  playBeepSound() {
    beepAudio.currentTime = 0;
    beepAudio.play();
  },
  reinitializeConfig({ config, name } = {}, [m, s, l] = []) {
    this.updateName(name);
    this.removeWarningStyles();
    dispatch(timerSetConfig({ ...config }));
    const { minutes, seconds, length } = config;
    m = minutes;
    s = seconds;
    l = length;
  },
};
