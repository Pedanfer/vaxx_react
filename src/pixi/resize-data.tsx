export let resize: any;

export function createResizeData() {
  let frameWidth = window.innerWidth - (window.innerWidth / 20) * 2;
  let frameHeight = window.innerHeight - (window.innerHeight / 8) * 1.8;
  let originalSize = 200 * (window.innerWidth / 1750);

  resize = {
    frame: {
      twentiethWindow: window.innerWidth / 20,
      eighthWindow: window.innerHeight / 5.5,
      adjustFrameWidth: frameWidth,
      adjustFrameHeight: frameHeight,
    },
    text: {
      ratio: window.innerWidth / 1750,
    },
    message: {
      height: window.innerHeight / 20,
      width: window.innerWidth / 6,
      x: window.innerWidth / 5,
      y: window.innerHeight / 20,
    },
    vac: {
      width: window.innerWidth / 15,
      height: window.innerHeight / 28,
    },
    character: {
      adjustWidth: originalSize,
      adjustHeight: originalSize,
    },
  };
}
