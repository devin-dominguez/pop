export default {
  field: {
    width: 800,
    height: 600,
    color: 'red',
    flashColor: 'white'
  },

  score: {
    bubbleScoreMultiplier: 1000,
    bulletScore: 100,
    minBonusMultiplier: 2,
    maxBonusMultiplier: 16,
    waveClearBonusMultiplier: 10000,
    bonusMultiplierIncreaseRate: 0.25,
    color: 'red',
    highScoreColor: 'blue'
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
    containerColor: 'red',
    fillColor: 'pink'
  },

  trail: {
    minFadeTime: 0.01,
    maxFadeTime: 3,
    color: 'red'
  },

  burst: {
    fadeTime: 0.75,
    color: 'red',
    amount: 5,
    minSpeed: 20,
    maxSpeed: 50,
    size: 2,
  },

  bullet: {
    speed: 120,
    size: 4,
    fadeTime: 1,
    bubbleMultiplier: 3,

    color: 'white',
    escapedColor: 'red'
  },

  player: {
    size: 12,
    hitboxSize: 2,
    speed: 300,
    triggerColor: 'white',
    hitboxColor: 'red'
  },

  bubble: {
    sizeMultiplier: 5,
    signalMultiplier: 2.5,
    countdownSpeed: 36,
    placementAttempts: 500,
    bubbleColor: 'blue',
    signalColor: 'green',
    textColor: 'gray',
    activeTextColor: 'red'
  }
};
