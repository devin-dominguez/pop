import Config from './config';
import Field from './field';
import Player from './player';
import Bullet from './bullet';
import Time from './time';
import { drawCharacter } from './letters';
import { checkCircularCollision } from './utils';
import {
  BulletCollision,
  BubblePop,
  WaveClear
} from './events';

export default class Bubble {
  static init() {
    Object.assign(Bubble, Config.bubble);
    Bubble.reset();
  }

  static reset() {
    Bubble.bubbles = [];
    Bubble.currentWave = 1;
  }

  static update(dt) {
    if (Bubble.bubbles.length === 0) {
      Bubble.currentWave++;
      Bubble.makeWave();
      WaveClear.trigger(Bubble.currentWave);
    }

    Bubble.bubbles.forEach(bubble => bubble.update(dt));
    Bubble.bubbles = Bubble.bubbles.filter(bubble => !bubble.dead);
  }

  static draw(ctx) {
    Bubble.bubbles.forEach(bubble => bubble.draw(ctx));
    Bubble.bubbles.forEach(bubble => bubble.drawSignal(ctx));
  }

  static makeWave() {
    const { currentWave } = Bubble;
    for (let i = 0; i < currentWave; i++) {
      const bubbleCountForThisLevel = currentWave - i + 2;
      for (let j = 0; j < bubbleCountForThisLevel; j++) {
        const level = Math.min(16, j + 1);
        Bubble.bubbles.push(new Bubble(level));
      }
    }

    const placedBubbles = [];
    Bubble.bubbles.sort((a, b) => a.size > b.size ? -1 : 1).forEach(bubble => {
      const { size } = bubble;

      const minX = size;
      const minY = size;
      const maxX = Field.width - size;
      const maxY = Field.height - size;

      let placed = false;
      let attemptsRemaining = Bubble.placementAttempts;

      while (!placed && attemptsRemaining) {
          bubble.x = Math.random() * (maxX - minX) + minX;
          bubble.y = Math.random() * (maxY - minY) + minY;

        const noFit = placedBubbles.some(placedBubble => {
          return checkCircularCollision(
            placedBubble.collisionCircle,
            bubble.collisionCircle
          );
        }) || checkCircularCollision(
          Player.targetCollisionCircle,
          bubble.collisionCircle
        );

        if (!noFit) {
          placed = true;
        }

        attemptsRemaining--;
      }

      placedBubbles.push(bubble);
    });

    Time.setRateFromWave(currentWave);
  }

  static killAllActiveBubbles() {
    Bubble.bubbles.forEach(bubble => {
      if (bubble.active) {
        bubble.dead = true;
      }
    });
  }

  constructor(level) {
    // position gets set in Bubble.makeWave()
    this.x = 0;
    this.y = 0;
    this.level = level;
    this.size = (level + 1) * Bubble.sizeMultiplier;
    this.dead = false;
    this.active = false;
    this.signalSize = this.size * Bubble.signalMultiplier;
    this.progress = 1;
  }

  update(dt) {
    const isColliding = checkCircularCollision(
      this.collisionCircle,
      Player.targetCollisionCircle
    );

    if (isColliding) {
      this.active = true;
    }

    if (this.active) {
      this.signalSize -= Bubble.countdownSpeed * dt;
      this.progress = this.signalSize / (this.size * Bubble.signalMultiplier);
    }

    if (this.signalSize <= this.size) {
      this.signalSize = this.size;
      this.pop();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);

    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.75;
    ctx.fill();

    ctx.strokeStyle = Bubble.bubbleColor;
    ctx.globalAlpha = 1;
    ctx.stroke();

    const levelString = this.level <= 15 ? this.level.toString(16) : '+';
    ctx.globalAlpha = this.progress * this.progress;
    ctx.strokeStyle = this.active ? Bubble.activeTextColor : Bubble.textColor;
    drawCharacter(ctx, levelString, 0, 0, this.size / 3, true);

    ctx.restore();
  }

  drawSignal(ctx) {
    if (this.active) {
    ctx.save();
    ctx.translate(this.x, this.y);
      ctx.globalAlpha = 1 - (this.progress * this.progress);
      ctx.strokeStyle = Bubble.signalColor;
      ctx.beginPath();
      ctx.arc(0, 0, this.signalSize, 0, Math.PI * 2);
      ctx.stroke();
    ctx.restore();
    }
  }

  pop() {
    this.dead = true;
    Bullet.makeBulletsFromBubble(this);
    BubblePop.trigger(this.level);
  }

  get collisionCircle() {
    return {x: this.x, y: this.y, size: this.size};
  }
}

BulletCollision.subscribe(Bubble.killAllActiveBubbles);
