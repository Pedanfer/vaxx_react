//  Module imports
import * as PIXI from "pixi.js";
import * as resize from "./resize-data";
import {
  background,
  frameBackground,
  sendCharacter,
  init as initSprites,
} from "./sprite-config";
import { initMovLogic, pauseGame, resumeGame } from "./movement-logic";
import { loadSounds } from "./sound-config";

export let app: PIXI.Application<HTMLCanvasElement>;
export let charContainer: PIXI.Container;
export let frameContainer: PIXI.Container;
export let jabContainer: PIXI.Container;

let pointerLeftFrame: boolean = true;

export async function init(): Promise<PIXI.Application<HTMLCanvasElement>> {
  //  The order of execution is: typography, data, spriteConfig, movementLogic, soundConfig and PixiApp.
  resize.createResizeData();
  app = createApp();
  await initSprites();
  loadSounds();
  jabContainer = createStage();
  initMovLogic();
  requestAnimationFrame(() => app.renderer.render(app.stage));
  return app;
}

function createStage() {
  // Setting up containers and objects so that they are correctly layered
  // We want title > background > syringues > character > frame */

  jabContainer = new PIXI.Container();
  charContainer = new PIXI.Container();
  frameContainer = new PIXI.Container();

  frameContainer.addChild(frameBackground, charContainer, jabContainer);

  // frameContainer contains character container, therefore it overrides his mouse events,
  // that is why the events below don't fire if the cursor hovers on character

  frameContainer.onmouseleave = () => {
    pointerLeftFrame = true;
    pauseGame();
  };
  frameContainer.onmouseenter = (e) => {
    if (!pointerLeftFrame) return;
    pointerLeftFrame = false;
    sendCharacter(e);
    resumeGame(e);
  };

  app.stage.addChild(frameContainer, background);

  // TODO: add to stage when typography is finished
  // title

  return jabContainer;
}

function createApp() {
  const app = new PIXI.Application<HTMLCanvasElement>({
    resizeTo: window,
    antialias: true,
  });
  app.stage.interactive = true;
  PIXI.settings.RESOLUTION = 1;

  //  Improves graphics definition
  PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
  PIXI.settings.ROUND_PIXELS = true;
  PIXI.settings.RESOLUTION = window.devicePixelRatio;
  return app;
}
