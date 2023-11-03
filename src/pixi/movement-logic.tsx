// Movement logic for the playing data.character.SpriteConfig, limited by the e.currentTarget (frame)

import * as PIXI from "pixi.js";
import {
  SpriteConfig,
  billHandsSprite,
  billSprite,
  createSyringue,
  frameBackground,
} from "./sprite-config";
import { PixiApp, jabContainer } from "./pixi-app";
// import * as typography from "./typography";
import * as data from "./resize-data";
import { resize } from "./resize-data";
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
    //   if (!soundConfig.soundLibrary.find("throwSound").isPlaying) {
    //     soundConfig.soundLibrary.play("throwSound");
    //   }
  });
  throwTicker.minFPS = 3;
  throwTicker.maxFPS = 3;

  //  Tickers: PIXI-specific loops made to iterate at the same time than frame
  //  refreshment (or customizable), for animation mostly.
  vacMovement = new PIXI.Ticker();
  vacMovement.add(() => {
    let ratio = resize.text.ratio;
    for (let vac of jabContainer.children) {
      if (vac.x > frameBackground.x + frameBackground.width) {
        jabContainer.removeChild(vac);
      }
      vac.x += 5 * ratio;
    }
  });
  vacMovement.start();
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
  PixiApp.frameContainer.filters = [];
  //Main.app.stage.removeChild(pauseText);
  SpriteConfig.sendCharacter(e);
  //soundLibrary.resumeAll();
  vacMovement.start();
}

export function pauseGame() {
  SpriteConfig.billSprite.gotoAndStop(1);
  SpriteConfig.billHandsSprite.gotoAndStop(1);
  //SpriteConfig.sendCorrectPauseTextColor();
  PixiApp.frameContainer.filters = [pauseTint];
  throwTicker.stop();
  vacMovement.stop();
  //soundLibrary.pauseAll();
}

// export function addPauseText(option, color) {
//   if (option == "removeOld") {
//    PixiApp.app.stage.removeChild(pauseText);
//   }
//   pauseText = typography.sendPauseText(color);
//   pauseText.position.set(
//     SpriteConfig.frame.x * 4.8,
//     SpriteConfig.frame.y + SpriteConfig.frame.height / 2.9
//   );
//  PixiApp.app.stage.addChild(pauseText);
// }
