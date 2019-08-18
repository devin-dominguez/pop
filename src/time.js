import Config from './config';
import Field from './field';
import { constrain } from './utils';
import {
  BulletCollision,
  BulletEscape,
  BubblePop,
  WaveClear,
  GameOver
} from './events';

export default class Time {
  static init() {
    Object.assign(Time, Config.time);
    Time.reset();
  }

  static reset() {
    Time.remaining = Time.initialTime;
    Time.countdownSpeed = Time.initialcountdownSpeed;
    Time.slow = false;
  }

  static update(dt, keys) {
      Time.slow = keys.z || keys.Z;

    if (Time.remaining > 0) {
      const rate = Time.slow ? Time.slowFactor : 1;
      Time.remaining -= rate * Time.countdownSpeed * dt;
      Time.remaining = Time.slow ? Math.min(Time.remaining, Time.bonusTime) : Time.remaining;
    } else {
      Time.remaining = 0;
      GameOver.trigger();
    }

    if (Time.remaining > Time.max) {
      Time.remaining = Time.max;
    }

    Time.flash = Time.isBonusTime ? !Time.flash : false;
  }

  static draw(ctx) {
    ctx.save();
    ctx.strokeStyle = Time.containerColor;
    ctx.strokeRect(0, 0, Time.containerWidth, Field.height);

    if (!Time.flash) {
      ctx.fillStyle = Time.fillColor;
      ctx.fillRect(0, Field.height, Time.containerWidth, -Time.normalized * Field.height);
    }

    const bonusOffset = (1 - (Time.bonusTime / Time.max)) * Field.height;
    ctx.beginPath();
    ctx.moveTo(0, bonusOffset);
    ctx.lineTo(Time.containerWidth, bonusOffset);
    ctx.stroke();

    const deathOffset = (1 - (Time.penalty / Time.max)) * Field.height;
    ctx.beginPath();
    ctx.moveTo(0, deathOffset);
    ctx.lineTo(Time.containerWidth, deathOffset);
    ctx.stroke();

    ctx.restore();
  }

  static onWaveClear() {
    Time.remaining += Time.waveClearBonus;
  }

  static onBulletEscape() {
    if (Time.slow) {
      return;
    }
    Time.remaining += Time.bulletEscapeBonus;
  }

  static onBubblePop(level) {
    if (Time.slow) {
      return;
    }
    const {
      maxBubbleBonus,
      minBubbleBonus,
      bubbleBonusMultiplier
    } = Time;

    const bonus = Math.min(
      maxBubbleBonus,
      bubbleBonusMultiplier * level + minBubbleBonus
    );

    Time.remaining += bonus;
  }

  static onBulletCollision() {
    Time.remaining = Math.min(Time.remaining, Time.bonusTime);
    Time.remaining -= Time.penalty;
  }

  static setRateFromWave(wave) {
    Time.countdownSpeed = Time.initialCountdownSpeed + (wave - 1) / 8;
  }

  static get isBonusTime() {
    return Time.remaining > Time.bonusTime;
  }

  static get normalized() {
    return constrain(Time.remaining / Time.max);
  }
}

BulletCollision.subscribe(Time.onBulletCollision);
BulletEscape.subscribe(Time.onBulletEscape);
BubblePop.subscribe(Time.onBubblePop);
WaveClear.subscribe(Time.onWaveClear);
