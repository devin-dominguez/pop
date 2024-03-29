import Color from './color';
const COLOR_A = new Color('#ff7573');
const COLOR_B = new Color('#73b7ff');
const COLOR_BG = new Color('#000000');
const COLOR_FG = new Color('#ffffff');

export default {
  backgroundColor: COLOR_BG,

  field: {
    width: 640,
    height: 480,
    color: COLOR_A,
    flashColor: COLOR_FG
  },

  backDrop: {
    color: COLOR_A,
    backgroundColor: COLOR_BG,
    rayCount: 32,
    rayRotationSpeed: Math.PI / 32,
    widthRatio: 1 / 4,
    riseAmount: 0.75
  },

  score: {
    bubbleScoreMultiplier: 1000,
    bulletScore: 100,
    minBonusMultiplier: 2,
    maxBonusMultiplier: 16,
    waveClearBonusMultiplier: 10000,
    bonusMultiplierIncreaseRate: 0.25,
    color: COLOR_FG,

    size: 20,
  },

  time: {
    max: 30,
    initialTime: 20,
    initialCountdownSpeed: 1,
    bonusTime: 25,
    penalty: 8,

    slowFactor: 4,

    maxBubbleBonus: 0.35,
    minBubbleBonus: 0.1,
    bubbleBonusMultiplier: 0.25,
    waveClearBonus: 2,

    bulletEscapeBonus: 0.0666,

    containerWidth: 32,
    padding: 8,
    containerColor: COLOR_A,
    fillColor: COLOR_B
  },

  trail: {
    minFadeTime: 0.01,
    maxFadeTime: 3,
    color: COLOR_A
  },

  burst: {
    fadeTime: 0.5,
    color: COLOR_A,
    amount: 32,
    minSpeed: 100,
    maxSpeed: 250,
    minSize: 1,
    maxSize: 4,
    angleRange: Math.PI / 8
  },

  bullet: {
    speed: 120,
    size: 4,
    fadeTime: 1,
    bubbleMultiplier: 3,

    poolSize: 500,

    color: COLOR_FG,
    backgroundColor: COLOR_BG,
    escapedColor: COLOR_A
  },

  player: {
    size: 12,
    hitboxSize: 2,
    speed: 300,
    triggerColor: COLOR_FG,
    hitboxColor: COLOR_A
  },

  bubble: {
    sizeMultiplier: 5,
    timeMultiplier: 0.25,
    fadeRate: 1,
    placementAttempts: 64,
    color: COLOR_B,
    pupilColor: COLOR_A,
    backgroundColor: COLOR_BG,

    poolSize: 250,
  }
};
