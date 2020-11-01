import { timerUpdateCurrentTime } from "../actions/controller.js";
import { dispatch, getState } from "../store/store.js";
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
    disableButtons() {
      incrementBtn.setAttribute("disabled", true);
      decrementBtn.setAttribute("disabled", true);
    },
    enableButtons() {
      incrementBtn.removeAttribute("disabled");
      decrementBtn.removeAttribute("disabled");
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
