import Config from './config';
import Field from './field';
import Player from './player';
import Bullet from './bullet';
import Time from './time';
import { checkCircularCollision } from './utils';
import {
  BulletCollision,
  BubblePop,
  WaveClear
} from './events';

const Bubbles  = {
  init() {
    Object.assign(this, Config.bubble);
    this.reset();
  },

   reset() {
    this.bubbles = [];
    this.currentWave = 10;
  },

  update(dt) {
    if (this.bubbles.length === 0) {
      WaveClear.trigger(this.currentWave);
      this.currentWave++;
      this.makeWave();
    }

    const aliveBubbles = [];
    for (let i = 0, l = this.bubbles.length; i < l; i++) {
      const bubble = this.bubbles[i];
      this.updateBubble(bubble, dt);
      if (!bubble.dead) {
        aliveBubbles.push(bubble);
      }
    }

    this.bubbles = aliveBubbles;
  },

  draw(ctx) {
    for (let i = 0, l = this.bubbles.length; i < l; i++) {
      const bubble = this.bubbles[i];
      this.drawBubble(bubble, ctx);
    }
  },

   makeWave() {
    const { currentWave } = this;
    for (let i = 0; i < currentWave; i++) {
      const bubbleCountForThisLevel = currentWave - i + 2;
      for (let j = 0; j < bubbleCountForThisLevel; j++) {
        const level = Math.min(16, j + 1);
        this.bubbles.push(this.createBubble(level));
      }
    }

    const placedBubbles = [];
    this.bubbles.sort((a, b) => a.size > b.size ? -1 : 1).forEach(bubble => {
      const { size } = bubble;

      const minX = size;
      const minY = size;
      const maxX = Field.width - size;
      const maxY = Field.height - size;

      let placed = false;
      let attemptsRemaining = this.placementAttempts;

      while (!placed && attemptsRemaining) {
          bubble.x = Math.random() * (maxX - minX) + minX;
          bubble.y = Math.random() * (maxY - minY) + minY;

        const noFit = placedBubbles.some(placedBubble => {
          return checkCircularCollision(
            placedBubble,
            bubble
          );
        }) || checkCircularCollision(
          Player,
          bubble
        );

        if (!noFit) {
          placed = true;
        }

        attemptsRemaining--;
      }

      placedBubbles.push(bubble);
    });

    Time.setRateFromWave(currentWave);
  },

   killAllActiveBubbles() {
    this.bubbles.forEach(bubble => {
      if (bubble.active) {
        bubble.dead = true;
      }
    });
  },

  createBubble(level) {
    // position gets set in Bubbles.makeWave()
    const bubble = {};
    bubble.x = 0;
    bubble.y = 0;
    bubble.level = level;
    bubble.size = (level + 1) * this.sizeMultiplier;
    bubble.dead = false;
    bubble.active = false;
    bubble.fadeRate = level * this.timeMultiplier * this.fadeRate;
    bubble.fade = 1;
    bubble.flash = false;

    return bubble;
  },

  updateBubble(bubble, dt) {
    const isColliding = checkCircularCollision(bubble, Player);

    if (isColliding && !bubble.active) {
      bubble.active = true;
      bubble.flash = true;
    }

    if (bubble.active) {
      bubble.fade -=  dt / bubble.fadeRate;
    }

    if (bubble.fade <= 0) {
      bubble.fade = 0;
      this.popBubble(bubble);
    }
  },

  drawBubble(bubble, ctx) {
    ctx.fillStyle = this.backgroundColor.value;
    ctx.strokeStyle = this.color.value;

    // eye
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // lid
    ctx.beginPath();
    ctx.ellipse(bubble.x, bubble.y, bubble.size, bubble.size * bubble.fade, 0, 0, Math.PI);
    ctx.ellipse(bubble.x, bubble.y, bubble.size, bubble.size * bubble.fade, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.clip();

    // pupil
    const angle = Math.atan2(Player.y - bubble.y, Player.x - bubble.x);
    const offsetX = (bubble.size / 6) * Math.cos(angle);
    const offsetY = (bubble.size / 6) * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(bubble.x + offsetX, bubble.y + offsetY, bubble.size / 2, 0, Math.PI * 2);

    if (bubble.flash) {
      ctx.fillStyle = this.pupilColor.value;
      bubble.flash = false;
    }
    ctx.strokeStyle = this.pupilColor.value;

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  popBubble(bubble) {
    bubble.dead = true;
    Bullet.makeBulletsFromBubble(bubble);
    BubblePop.trigger(bubble.level);
  }
}

BulletCollision.subscribe(Bubbles.killAllActiveBubbles.bind(Bubbles));

export default Bubbles;
