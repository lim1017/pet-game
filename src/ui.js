export const modFox = function modFox(state) {
  document.querySelector(".fox").className = `fox fox-${state}`;
};

export const modScene = function modScene(state) {
  document.querySelector(".game").className = `game ${state}`;
};

export const togglePoop = function TogglePoop(show) {
  document.querySelector(".poop-bag").classList.toggle("hidden", !show);
};