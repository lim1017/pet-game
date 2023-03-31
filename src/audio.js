import { Howl } from "howler";

import intro1 from "./audio/cartoon-hello.mp3";
import intro2 from "./audio/echoed-hello-1-95898.mp3";
import intro3 from "./audio/hello-female-friendly-professional-87141.mp3";
import intro4 from "./audio/pinkie-pie-hello-86138.mp3";

import hungrySound from "./audio/grumbles-38430.mp3";
import poopSound from "./audio/poop.mp3";
import failGameSound from "./audio/level-fail-sound-effect.mp3";
import ouchSound from "./audio/ouch.mp3";
import celebrateSound from "./audio/celebrate.mp3";
const introArr = [intro1, intro2, intro3, intro4];

const selectedIntro = introArr[Math.floor(Math.random() * 5)];

export const startGameAudio = new Howl({
  src: [selectedIntro],
  html5: true,
});

export const celebrateAudio = new Howl({
  src: [celebrateSound],
  html5: true,
});

export const ouchAudio = new Howl({
  src: [ouchSound],
  html5: true,
});

export const hungryAudio = new Howl({
  src: [hungrySound],
  html5: true,
});

export const poopAudio = new Howl({
  src: [poopSound],
  html5: true,
});

export const failGameAudio = new Howl({
  src: [failGameSound],
  html5: true,
});
