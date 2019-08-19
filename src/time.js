import Config from './config';
import Field from './field';
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
    Time.normalized = Time.remaining / Time.max;
    Time.isBonusTime = false;

    Time.meterHeight = Field.height - (Time.padding * 2)
    Time.bonusOffset = (1 - (Time.bonusTime / Time.max)) * Time.meterHeight;
    Time.deathOffset = (1 - (Time.penalty / Time.max)) * Time.meterHeight;
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

    if (Time.remaining < 0) {
      Time.remaining = 0;
    }

    Time.normalized = Time.remaining / Time.max;
    Time.isBonusTime = Time.remaining > Time.bonusTime;

    Time.flash = Time.isBonusTime ? !Time.flash : false;
  }

  static draw(ctx) {
    if (!Time.flash) {
      ctx.strokeStyle = Time.fillColor;
      ctx.strokeRect(
        Time.padding,
        Field.height - Time.padding,
        Time.containerWidth - (Time.padding * 2),
        -Time.normalized * (Field.height - (Time.padding * 2))
      );
    }

    ctx.strokeStyle = Time.containerColor;

    ctx.strokeRect(0, 0, Time.containerWidth, Field.height);

    ctx.beginPath();
    ctx.moveTo(0, Time.bonusOffset);
    ctx.lineTo(Time.containerWidth, Time.bonusOffset);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, Time.deathOffset);
    ctx.lineTo(Time.containerWidth, Time.deathOffset);
    ctx.stroke();
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
}

BulletCollision.subscribe(Time.onBulletCollision);
BulletEscape.subscribe(Time.onBulletEscape);
BubblePop.subscribe(Time.onBubblePop);
WaveClear.subscribe(Time.onWaveClear);
