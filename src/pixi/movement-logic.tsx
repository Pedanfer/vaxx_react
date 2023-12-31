// Movement logic for the playing data.character.SpriteConfig, limited by the e.currentTarget (frame)

import * as PIXI from "pixi.js";
import {
  billHandsSprite,
  billSprite,
  createSyringue,
  frameBackground,
  sendCharacter,
} from "./sprite-config";
import { frameContainer, jabContainer } from "./pixi-app";
// import * as typography from "./typography";
import * as data from "./resize-data";
import { resize } from "./resize-data";
import { billSounds, generalSounds } from "./sound-config";
// import { soundLibrary } from "./soundConfig";

export let pauseText: boolean;
export let vacMovement: PIXI.Ticker;
export let throwTicker: PIXI.Ticker;

const pauseTint = new PIXI.ColorMatrixFilter();
pauseTint.blackAndWhite(false);

export function initMovLogic() {
  createTickers();
}

function createTickers() {
  throwTicker = new PIXI.Ticker();
  throwTicker.add(() => {
    createSyringue();
    if (!generalSounds.find("throwSound").isPlaying) {
      generalSounds.play("throwSound");
    }
  });
  //TODO: Interesting for power-ups!
  throwTicker.minFPS = 2;
  throwTicker.maxFPS = 2;

  //  Tickers: PIXI-specific loops made to iterate at the same time than frame
  //  refreshment (or customizable), for animation mostly.
  vacMovement = new PIXI.Ticker().add(() => {
    let ratio = resize.text.ratio;
    for (let vac of jabContainer.children) {
      if (vac.x > frameBackground.x + frameBackground.width) {
        jabContainer.removeChild(vac);
      }
      vac.x += 5 * ratio;
    }
  });
}

export function playerCursorSync(e: PIXI.FederatedPointerEvent) {
  if (e.target != null) {
    billSprite.position.set(e.globalX, e.globalY);
    billHandsSprite.position.set(
      billSprite.x + 90 * data.resize.text.ratio,
      billSprite.y + 65 * data.resize.text.ratio
    );
  }
}

export function getCharStartingPoint(e: PIXI.FederatedPointerEvent) {
  return new PIXI.Point(e.globalX, e.globalY);
}

export function resumeGame(e: PIXI.FederatedPointerEvent) {
  frameContainer.filters = [];
  //Main.app.stage.removeChild(pauseText);
  sendCharacter(e);
  generalSounds.resumeAll();
  billSounds.resumeAll();
  vacMovement.start();
}

export function pauseGame() {
  billSprite.gotoAndStop(1);
  billHandsSprite.gotoAndStop(1);
  //sendCorrectPauseTextColor();
  frameContainer.filters = [pauseTint];
  throwTicker.stop();
  vacMovement.stop();
  generalSounds.pauseAll();
  billSounds.pauseAll();
}

// export function addPauseText(option, color) {
//   if (option == "removeOld") {
//    PixiApp.app.stage.removeChild(pauseText);
//   }
//   pauseText = typography.sendPauseText(color);
//   pauseText.position.set(
//     frame.x * 4.8,
//     frame.y + frame.height / 2.9
//   );
//  PixiApp.app.stage.addChild(pauseText);
// }
