//const COLOR_A = 'red';
//const COLOR_B = 'blue';
//const COLOR_BG = 'black';
//const COLOR_FG = 'white';
const COLOR_A = '#ff7573';
const COLOR_B = '#73b7ff';
const COLOR_BG = '#black';
const COLOR_FG = 'white';

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
    rayCount: 16,
    rayAngle: Math.PI / 32,
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
    color: COLOR_A,
    highScoreColor: COLOR_FG,

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

    color: COLOR_FG,
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
    signalMultiplier: 2.5,
    countdownSpeed: 36,
    placementAttempts: 150,
    color: COLOR_B,
    pupilColor: COLOR_A,
    backgroundColor: COLOR_BG
  }
};
