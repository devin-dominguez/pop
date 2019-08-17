import Config from './config';
import Time from './time';
import { drawString } from './letters';
import { constrain } from './utils';

export default class Score {
  static init() {
    Object.assign(Score, Config.score);

    Score.currentScore = 0;
    Score.multiplier = 1;
    Score.bonusTime = false;
    if (!Score.highScore) {
      Score.highScore = 0;
    }
  }

  static update(dt) {
    if (Time.isBonusTime && !Score.bonusTime) {
      Score.bonusTime = true;
      Score.currentMultiplier = Score.minBonusMultiplier;
    }

    if (!Time.isBonusTime) {
      Score.bonusTime = false;
    }

    if (!Score.bonusTime) {
      Score.multiplier = 1;
    } else {
      Score.multiplier += dt;
      const { minBonusMultiplier, maxBonusMultiplier, multiplier } = Score;
      Score.multiplier = constrain(multiplier, minBonusMultiplier, maxBonusMultiplier);
    }
  }

  static draw(ctx) {
    ctx.save();
    ctx.strokeStyle = Score.isHighScore ? Score.highScoreColor : Score.color;

    drawString(ctx, Score.scoreString, 0, 0, 10);

    ctx.restore();
  }

  static onBulletEscape() {
    Score.currentScore += Score.bulletScore * Score.multiplier;
  }

  static onBubblePop(level) {
    Score.currentScore += Score.bubbleScoreMultiplier * level * Score.multiplier;
  }

  static onGameOver() {
    Score.highScore = Math.max(Score.score, Score.highScore);
  }

  static get isHighScore() {
    return Score.score > Score.highScore;
  }

  static get score() {
    return Math.floor(Score.currentScore);
  }

  static get scoreString() {
    return `SCORE ${Score.score.toString()}`;
  }
}
