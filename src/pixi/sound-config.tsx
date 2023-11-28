import * as PIXI from "pixi.js";
import { Sound, SoundLibrary, sound } from "@pixi/sound";

const generalSounds = sound;
let pause = true;
let soundsIndex = 0;
let currentSound: Sound;

const soundBundle: Record<string, string> = {
  sound1: "/Sounds/sound4.mp3",
  sound2: "/Sounds/moar.mp3",
  sound3: "/Sounds/goal.mp3",
  sound4: "/Sounds/moar.mp3",
  sound5: "/Sounds/significant.mp3",
  sound6: "/Sounds/moar.mp3",
  sound7: "/Sounds/profit.mp3",
  sound8: "/Sounds/moar.mp3",
};

const { billSounds, backMusic } = loadSounds();

function loadSounds() {
  const billSounds = new SoundLibrary();

  for (const key in soundBundle) {
    billSounds.add(key, { url: soundBundle[key], preload: true });
  }

  sound.volumeAll = 0.4;

  const backMusic = sound.add("backMusic", {
    url: "/Sounds/backMusic2.mp3",
    volume: 0.3,
    preload: true,
    loop: true,
  });

  sound.add("throwSound", {
    url: "/Sounds/throw.mp3",
    preload: true,
    volume: 0.6,
  });
  return { billSounds, backMusic };
}

function checkSound() {
  const currentSoundKey = `sound${soundsIndex + 1}`;
  return billSounds.find(currentSoundKey).isPlaying;
}

export function billSoundLoop() {
  if (pause) {
    currentSound = billSounds.find(`sound${soundsIndex + 1}`);
    if (!checkSound()) {
      console.log(currentSound.duration);
      pause = false;
      setTimeout(function () {
        pause = true;
      }, 20000 + currentSound.duration * 1000);
      currentSound.play();
      soundsIndex++;
      if (soundsIndex == Object.keys(soundBundle).length - 1) {
        soundsIndex = 0;
      }
    }
  }
}

export const musicStartTicker = new PIXI.Ticker().add(() => {
  if (!currentSound.isPlaying) {
    setTimeout(() => {
      backMusic.play();
    }, 200);
    musicStartTicker.stop();
  }
});

export { generalSounds, billSounds, loadSounds };
