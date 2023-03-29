import gameState from "./gameState";
import { TICK_RATE } from "./constants";
import initButtons from "./buttons";

const { handleUserAction, tick, clock, current } = gameState;
const boundTick = tick.bind(gameState);
const boundUserAction = handleUserAction.bind(gameState);

function init() {
  initButtons(boundUserAction);

  let nextTimeToTick = Date.now();

  function nextAnimationFrame() {
    const now = Date.now();

    if (nextTimeToTick <= now) {
      boundTick();
      nextTimeToTick = now + TICK_RATE;
    }

    requestAnimationFrame(nextAnimationFrame);
  }

  nextAnimationFrame();
}

init();
