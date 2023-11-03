import * as PIXI from "pixi.js";

// import * as soundConfig from "./soundConfig";
// import * as movementLogic from "./movementLogic";
import {
  getCharStartingPoint,
  playerCursorSync,
  throwTicker,
} from "./movement-logic";
// import * as typography from "./typography";
import * as data from "./resize-data";
import { FederatedPointerEvent } from "pixi.js";
import { PixiApp, frameContainer } from "./pixi-app";

// export let title = typography.addText();
export let frameIndex: number;
export let background: PIXI.Graphics;
export let frameBackgrounds: PIXI.Graphics[] = [];
export let frameBackground: PIXI.Graphics;
export let billSprite: PIXI.AnimatedSprite;
export let billHandsSprite: PIXI.AnimatedSprite;
export let virusSprite: PIXI.Sprite;
export let virusSprite2: PIXI.Sprite;

function createBillSprite(name: string) {
  let animCounter = 0;
  let animArray: PIXI.AnimatedSprite[] = [];
  const spritesheet = PIXI.Assets.get(name);
  animArray.push(new PIXI.AnimatedSprite(spritesheet.animations[name]));

  let anim = animArray[animCounter++];
  anim.animationSpeed = 0.11;
  anim.interactive = true;
  anim.cursor = "pointer";
  anim.loop = false;
  return anim;
}

function sendFrame(texture: PIXI.Texture) {
  var frameMatrix = new PIXI.Matrix(
    data.resize.frame.adjustFrameWidth / 1920,
    0,
    0,
    data.resize.frame.adjustFrameHeight / 1080
  );

  let frame = new PIXI.Graphics();
  frame
    .beginTextureFill({
      texture: texture,
      matrix: frameMatrix,
    })
    .drawRoundedRect(
      0,
      0,
      data.resize.frame.adjustFrameWidth,
      data.resize.frame.adjustFrameHeight,
      10
    )
    .endFill();
  frame.position.set(
    data.resize.frame.twentiethWindow,
    data.resize.frame.eighthWindow
  );
  frame.interactive = true;
  frame.cursor = "none";
  return frame;
}

export function createSyringue() {
  var syringue = PIXI.Sprite.from("Images/syringue.png");
  syringue.position.set(
    billHandsSprite.x + billHandsSprite.width * 0.43,
    billHandsSprite.y + billHandsSprite.height / 1.6
  );
  syringue.width = data.resize.vac.width;
  syringue.height = data.resize.vac.height;
  PixiApp.jabContainer.addChild(syringue);
  return syringue;
}

async function setup() {
  billSprite = await createBillSprite("billHead");
  billHandsSprite = await createBillSprite("billHands");

  billHandsSprite.cursor = "none";
  billSprite.cursor = "none";

  const virusTexture1 = (await PIXI.Assets.get("virus")).texture;
  const virusTexture2 = (await PIXI.Assets.get("virus")).texture;

  virusSprite = new PIXI.Sprite(virusTexture1);
  virusSprite2 = new PIXI.Sprite(virusTexture2);
  // TODO: screen adjust for later
  adjustVirusSize();

  billSprite.onComplete = () => billSprite.gotoAndStop(1);
  billHandsSprite.onComplete = () => billHandsSprite.gotoAndStop(1);

  frameContainer.onpointerdown = () => {
    billSprite.gotoAndStop(0);
    billHandsSprite.gotoAndStop(0);
    // TODO: soundConfig
    // soundConfig.billSoundLoop();
    // soundConfig.soundLibrary.play("throwSound");
    createSyringue();
    throwTicker.start();
  };

  frameContainer.onpointerup = () => {
    setTimeout(() => {
      billSprite.gotoAndPlay(1);
      billHandsSprite.gotoAndPlay(1);
    }, 300);
    throwTicker.stop();
  };

  // billSprite.once("pointerdown", (e) => {
  //   soundConfig.musicStartTicker.start();
  // });
}

async function loadAssetsAndSetup() {
  PIXI.Assets.addBundle("main", {
    billHead: "Images/squirt.json",
    billHands: "Images/billThrows.json",
    virus: "../..//Images/tileVirus.png",
  });

  PIXI.Assets.loadBundle("main").then(async () => {
    await setup();
  });
}

function backGroundWithHole() {
  return new PIXI.Graphics()
    .beginTextureFill({
      texture: PIXI.Texture.from("Images/background.png"),
      matrix: new PIXI.Matrix(1, 0, 0, 1),
    })
    .drawRect(0, 0, window.innerWidth, window.innerHeight)
    .endFill()
    .beginHole()
    .drawRoundedRect(
      data.resize.frame.twentiethWindow,
      data.resize.frame.eighthWindow,
      data.resize.frame.adjustFrameWidth,
      data.resize.frame.adjustFrameHeight,
      10
    )
    .endHole();
}

function fillFrameArray() {
  const frameTextures = [
    PIXI.Texture.from("Images/background1.jpg"),
    PIXI.Texture.from("Images/background2.png"),
    PIXI.Texture.from("Images/background3.jpg"),
    PIXI.Texture.from("Images/background4.jpg"),
  ];
  if (frameBackgrounds.length != 0) {
    frameBackgrounds.length = 0;
  }
  for (const texture of frameTextures) {
    frameBackgrounds.push(sendFrame(texture));
  }
}

function frameSync_charResize(option: string = "") {
  frameBackground.on("pointermove", playerCursorSync);
  billSprite.on("pointermove", playerCursorSync);

  if (option == "windowAdjust") {
    billSprite.position.set(
      billSprite.x * (data.resize.character.adjustWidth / billSprite.width),
      billSprite.y * (data.resize.character.adjustHeight / billSprite.height)
    );
  }
  billSprite.width = data.resize.character.adjustWidth;
  billSprite.height = data.resize.character.adjustHeight;
  billHandsSprite.width = billSprite.width;
  billHandsSprite.height = billSprite.height;
}

export function sendCharacter(event: FederatedPointerEvent) {
  const charPosition = getCharStartingPoint(event);
  billSprite.gotoAndStop(1);
  billHandsSprite.gotoAndStop(1);

  frameSync_charResize();
  PixiApp.charContainer.addChild(billSprite);
  PixiApp.charContainer.addChild(billHandsSprite);

  billSprite.position.set(charPosition.x, charPosition.y);
  billHandsSprite.position.set(
    charPosition.x + +90 * data.resize.text.ratio,
    charPosition.y + 65 * data.resize.text.ratio
  );
}

export async function init() {
  frameIndex = 0;
  background = backGroundWithHole();
  fillFrameArray();
  frameBackground = frameBackgrounds[0];

  await loadAssetsAndSetup();

  // Resizing the game on window data.resize event
  window.addEventListener(
    "resize",
    function () {
      data.createResizeData();
      fillFrameArray();
      //PixiApp.app.stage.removeChild(background, title);
      PixiApp.frameContainer.removeChild(frameBackground);
      background = backGroundWithHole();
      frameBackground = frameBackgrounds[frameIndex];
      // title = typography.addText("loop");
      //PixiApp.app.stage.addChild(background, title);
      PixiApp.frameContainer.addChildAt(frameBackground, 0);
      frameSync_charResize("windowAdjust");
      adjustVirusSize();
      //resize_relocateProjectiles();
      // sendCorrectPauseTextColor();
    },
    true
  );
}

export * as SpriteConfig from "./sprite-config";

// export let title = typography.addText();

// typography.titleMouseOver();
//textClickLoopFrames();

function adjustVirusSize() {
  virusSprite.setTransform(
    window.innerWidth,
    window.innerHeight * 0.0001,
    0.24 * data.resize.text.ratio,
    0.24 * data.resize.text.ratio
  );
  virusSprite.scale.x *= -1;
  virusSprite2.setTransform(
    0,
    window.innerHeight * 0.0001,
    0.24 * data.resize.text.ratio,
    0.24 * data.resize.text.ratio
  );
  PixiApp.app.stage.addChild(virusSprite, virusSprite2);
}

// TODO: update typography
// export function textClickLoopFrames() {
//   typography.text.click = () => {
//     if (frameIndex == frames.length - 1) {
//       frameIndex = -1;
//     }
//     PixiApp.frameContainer.removeChild(frame);
//     frame = frames[++frameIndex];
//     sendCorrectPauseTextColor();
//     PixiApp.frameContainer.addChildAt(frame, 0);
//   };
// }

// export function sendCorrectPauseTextColor() {
//   if (frameIndex > 1) {
//     movementLogic.addPauseText("removeOld", 0x000000);
//   } else {
//     movementLogic.addPauseText("removeOld", 0xffffff);
//   }
// }

// export function resize_relocateProjectiles() {
//   let vacRatio = {
//     x: data.resize.vac.width / PixiApp.jabContainer.children[0].width,
//     y: data.resize.vac.height / PixiApp.jabContainer.children[0].height,
//   };
//   for (let vac of PixiApp.jabContainer.children) {
//     vac.x = vac.x * vacRatio.x;
//     vac.y = vac.y * vacRatio.y;
//     vac.width = data.resize.vac.width;
//     vac.height = data.resize.vac.height;
//   }
// }
