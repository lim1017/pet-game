import { modFox, modScene, togglePoop, writeModal } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";

import {
  startGameAudio,
  poopAudio,
  ouchAudio,
  failGameAudio,
  hungryAudio,
  celebrateAudio,
} from "./audio";

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
  heartFillCount: 0,
  tick() {
    if (this.current === "DEAD") return;

    this.clock++;
    // console.log(this.clock, this);
    if (this.clock === this.wakeTime) {
      this.wake();
      startGameAudio.play();
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

        // if (this.heartFillCount === hearts.length) {
        //   victoryAudio.play();
        // }
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
    if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current))
      return;

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    // execute the currently selected action
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
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    this.fillHeart();
    modFox("egg");
    modScene("day");
    writeModal("Welcome, Keep your pet alive by feeding and cleaning!");
  },
  wake() {
    this.current = "IDLING";
    this.lastFeed = this.wakeTime;
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determinePetState();
  },
  sleep() {
    this.state = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    modFox("hungry");
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    hungryAudio.play();
    this.hungryTime = -1;
    writeModal("Your pet is hungry Food time!");
  },
  feed() {
    if (this.current !== "HUNGRY") return;

    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToCelebrate = this.clock + 2;
    this.fillHeart();
  },
  poop() {
    writeModal("Your pet is pooping, clean up!");
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
    setTimeout(() => {
      poopAudio.play();
    }, 2500);
  },
  die() {
    if (this.heartFillCount > 0) {
      writeModal("You neglected your pet!");
      ouchAudio.play();
      modFox("hurt");
      this.removeHeart();
      setTimeout(() => {
        this.wake();
        writeModal("");
      }, 3000);
      return;
    } else {
      writeModal("RIP, Try again!");
      failGameAudio.play();
      modFox("dead");
      modScene("dead");
      this.current = "DEAD";
    }
  },
  celebrate() {
    writeModal("");

    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToCelebrate = -1;
    this.timeToStopCelebrate = this.clock + 2;
    celebrateAudio.play();
  },
  endCelebrate() {
    this.current = "IDLING";
    this.timeToStopCelebrate = -1;
    this.determinePetState();
    togglePoop(false);
  },
  determinePetState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else {
        modFox("idling");
      }
    }
  },
  changeWeather() {
    this.scene = this.scene === 1 ? 2 : 1;
    modScene(SCENES[this.scene]);
    this.determinePetState();
  },
  cleanUpPoop() {
    console.log("cleanup poop");
    if (this.current !== "POOPING") return;

    this.dieTime = -1;
    togglePoop(true);
    this.celebrate();
    this.hungryTime = getNextHungerTime(this.clock);
  },
};

export default gameState;
