import gameState from "./gameState";

const { tick, clock, current } = gameState;
const boundTick = tick.bind(gameState);

const TICK_RATE = 2000;

function init() {
  console.log("Starting Game");

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
