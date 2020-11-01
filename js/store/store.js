import {
  decrementBreakLength,
  decrementSessionLength,
  incrementBreakLength,
  incrementSessionLength,
  timerSetConfig,
} from "../actions/controller.js";
import {
  breakLengthController,
  sessionLengthController,
} from "../components/LengthController.js";
import { ClockTimer } from "../components/Timer.js";
import { getParsedTime } from "../helpers/helpers.js";
import { clockReducer } from "../reducers/reducers.js";
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
