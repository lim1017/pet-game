// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.togglePoop = exports.modScene = exports.modFox = void 0;
const modFox = function modFox(state) {
  document.querySelector(".fox").className = `fox fox-${state}`;
};
exports.modFox = modFox;
const modScene = function modScene(state) {
  document.querySelector(".game").className = `game ${state}`;
};
exports.modScene = modScene;
const togglePoop = function TogglePoop(show) {
  document.querySelector(".poop-bag").classList.toggle("hidden", !show);
};
exports.togglePoop = togglePoop;
},{}],"constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextPoopTime = exports.getNextHungerTime = exports.getNextDieTime = exports.TICK_RATE = exports.SCENES = exports.RAIN_CHANCE = exports.NIGHT_LENGTH = exports.ICONS = exports.DAY_LENGTH = void 0;
const TICK_RATE = 1000;
exports.TICK_RATE = TICK_RATE;
const ICONS = ["fish", "poop", "weather"];
exports.ICONS = ICONS;
const RAIN_CHANCE = 0.2;
exports.RAIN_CHANCE = RAIN_CHANCE;
const SCENES = ["day", "rain"];
exports.SCENES = SCENES;
const DAY_LENGTH = 60;
exports.DAY_LENGTH = DAY_LENGTH;
const NIGHT_LENGTH = 5;
exports.NIGHT_LENGTH = NIGHT_LENGTH;
const getNextHungerTime = clock => Math.floor(Math.random() * 3) + 4 + clock;
exports.getNextHungerTime = getNextHungerTime;
const getNextPoopTime = clock => Math.floor(Math.random() * 6) + 6 + clock;
exports.getNextPoopTime = getNextPoopTime;
const getNextDieTime = clock => Math.floor(Math.random() * 2) + 10 + clock;
exports.getNextDieTime = getNextDieTime;
},{}],"gameState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ui = require("./ui");
var _constants = require("./constants");
const hearts = document.querySelectorAll(".heart");
const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToCelebrate: -1,
  timeToStopCelebrate: -1,
  heartFillCount: 1,
  //todo make it so it restarts game with 1
  tick() {
    if (this.current === "DEAD") return;
    this.clock++;
    console.log(this.clock, this);
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.timeToCelebrate) {
      this.celebrate();
    } else if (this.clock === this.timeToStopCelebrate) {
      this.endCelebrate();
    } else if (this.clock === this.poopTime) {
      this.poop();
    } else if (this.clock === this.dieTime) {
      this.die();
    }
    return this.clock;
  },
  fillHeart() {
    if (this.heartFillCount < hearts.length) {
      hearts[this.heartFillCount].classList.add("animate");
      setTimeout(() => {
        hearts[this.heartFillCount].classList.add("filled");
        hearts[this.heartFillCount].classList.remove("animate");
        this.heartFillCount++;
      }, 1000);
    }
  },
  removeHeart() {
    if (this.heartFillCount > 0) {
      hearts[this.heartFillCount - 1].classList.add("unfillAnimate");
      setTimeout(() => {
        hearts[this.heartFillCount - 1].classList.remove("unfillAnimate");
        hearts[this.heartFillCount - 1].classList.remove("filled");
        this.heartFillCount--;
      }, 1000);
    }
  },
  handleUserAction(icon) {
    if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)) return;
    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }
    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  startGame() {
    console.log("Starting Game");
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    (0, _ui.modFox)("egg");
    (0, _ui.modScene)("day");
  },
  wake() {
    this.current = "IDLING";
    this.lastFeed = this.wakeTime;
    this.wakeTime = -1;
    this.scene = Math.random() > _constants.RAIN_CHANCE ? 0 : 1;
    (0, _ui.modScene)(_constants.SCENES[this.scene]);
    this.sleepTime = this.clock + _constants.DAY_LENGTH;
    this.hungryTime = (0, _constants.getNextHungerTime)(this.clock);
    this.determinePetState();
  },
  sleep() {
    this.state = "SLEEP";
    (0, _ui.modFox)("sleep");
    (0, _ui.modScene)("night");
    this.wakeTime = this.clock + _constants.NIGHT_LENGTH;
  },
  getHungry() {
    (0, _ui.modFox)("hungry");
    this.current = "HUNGRY";
    this.dieTime = (0, _constants.getNextDieTime)(this.clock);
    this.hungryTime = -1;
  },
  feed() {
    if (this.current !== "HUNGRY") return;
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = (0, _constants.getNextPoopTime)(this.clock);
    (0, _ui.modFox)("eating");
    this.timeToCelebrate = this.clock + 2;
    this.fillHeart();
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = (0, _constants.getNextDieTime)(this.clock);
    (0, _ui.modFox)("pooping");
  },
  die() {
    if (this.heartFillCount > 0) {
      (0, _ui.modFox)("hurt");
      this.removeHeart();
      setTimeout(() => {
        this.wake();
      }, 3000);
      return;
    } else {
      (0, _ui.modFox)("dead");
      (0, _ui.modScene)("dead");
      this.current = "DEAD";
      console.log("dead fox");
    }
  },
  celebrate() {
    this.current = "CELEBRATING";
    (0, _ui.modFox)("celebrate");
    this.timeToCelebrate = -1;
    this.timeToStopCelebrate = this.clock + 3;
  },
  endCelebrate() {
    this.current = "IDLING";
    this.timeToStopCelebrate = -1;
    this.determinePetState();
    (0, _ui.togglePoop)(false);
  },
  determinePetState() {
    if (this.current === "IDLING") {
      if (_constants.SCENES[this.scene] === "rain") {
        (0, _ui.modFox)("rain");
      } else {
        (0, _ui.modFox)("idling");
      }
    }
  },
  changeWeather() {
    this.scene = this.scene === 1 ? 2 : 1;
    (0, _ui.modScene)(_constants.SCENES[this.scene]);
    this.determinePetState();
  },
  cleanUpPoop() {
    console.log("cleanup poop");
    if (this.current !== "POOPING") return;
    this.dieTime = -1;
    (0, _ui.togglePoop)(true);
    this.celebrate();
    this.hungryTime = (0, _constants.getNextHungerTime)(this.clock);
  }
};
var _default = gameState;
exports.default = _default;
},{"./ui":"ui.js","./constants":"constants.js"}],"buttons.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initButtons;
var _constants = require("./constants");
const toggleHighlighted = (icon, show) => {
  document.querySelector(`.${_constants.ICONS[icon]}-icon`).classList.toggle("highlighted", show);
};
function initButtons(handleUserAction) {
  let selectedIcon = 0;
  function buttonClick(event) {
    if (event.target.classList.contains("left-btn")) {
      //turns off current
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (2 + selectedIcon) % _constants.ICONS.length;
      //highlights new icon
      toggleHighlighted(selectedIcon, true);
    } else if (event.target.classList.contains("right-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (1 + selectedIcon) % _constants.ICONS.length;
      toggleHighlighted(selectedIcon, true);
    } else {
      handleUserAction(_constants.ICONS[selectedIcon]);
    }
  }
  document.querySelector(".buttons").addEventListener("click", buttonClick);
}
},{"./constants":"constants.js"}],"init.js":[function(require,module,exports) {
"use strict";

var _gameState = _interopRequireDefault(require("./gameState"));
var _constants = require("./constants");
var _buttons = _interopRequireDefault(require("./buttons"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  handleUserAction,
  tick,
  clock,
  current
} = _gameState.default;
const boundTick = tick.bind(_gameState.default);
const boundUserAction = handleUserAction.bind(_gameState.default);
function init() {
  (0, _buttons.default)(boundUserAction);
  let nextTimeToTick = Date.now();
  function nextAnimationFrame() {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      boundTick();
      nextTimeToTick = now + _constants.TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  }
  nextAnimationFrame();
}
init();
},{"./gameState":"gameState.js","./constants":"constants.js","./buttons":"buttons.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41643" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","init.js"], null)
//# sourceMappingURL=/init.9d6cb373.js.map