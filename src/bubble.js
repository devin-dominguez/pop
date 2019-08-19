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

export default class Bubble {
  static init() {
    Object.assign(Bubble, Config.bubble);
    Bubble.reset();
  }

  static reset() {
    Bubble.bubbles = [];
    Bubble.currentWave = 10;
  }

  static update(dt) {
    if (Bubble.bubbles.length === 0) {
      WaveClear.trigger(Bubble.currentWave);
      Bubble.currentWave++;
      Bubble.makeWave();
    }

    const aliveBubbles = [];
    for (let i = 0, l = Bubble.bubbles.length; i < l; i++) {
      const bubble = Bubble.bubbles[i];
      bubble.update(dt);
      if (!bubble.dead) {
        aliveBubbles.push(bubble);
      }
    }

    Bubble.bubbles = aliveBubbles;
  }

  static draw(ctx) {
    for (let i = 0, l = Bubble.bubbles.length; i < l; i++) {
      const bubble = Bubble.bubbles[i];
      bubble.draw(ctx);
    }

    //const length = Bubble.bubbles.length;

    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawBody(ctx);
      //bubble.drawBodyStroke(ctx);
      //ctx.restore();
    //}

    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawBody(ctx);
      //bubble.drawBodyFill(ctx);
      //ctx.restore();
    //}
    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawLid(ctx);
      //bubble.drawLidStroke(ctx);
      //ctx.restore();
    //}

    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawLid(ctx);
      //bubble.drawLidFill(ctx);
      //ctx.restore();
    //}
    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawEye(ctx);
      //bubble.drawEyeStroke(ctx);
      //ctx.restore();
    //}

    //for (let i = 0; i < length; i++) {
      //const bubble = Bubble.bubbles[i];
      //ctx.save();
      //ctx.translate(bubble.x, bubble.y);
      //bubble.drawEye(ctx);
      //bubble.drawEyeFill(ctx);
      //ctx.restore();
    //}
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
    this.fadeRate = (this.level * Bubble.timeMultiplier * Bubble.fadeRate);
    this.fade = 1;
    this.flash = false;
  }

  update(dt) {
    const isColliding = checkCircularCollision(this, Player);

    if (isColliding && !this.active) {
      this.active = true;
      this.flash = true;
    }

    if (this.active) {
      this.fade -=  dt / this.fadeRate;
    }

    if (this.fade <= 0) {
      this.fade = 0;
      this.pop();
    }
  }

  //drawBody(ctx) {
    //ctx.beginPath();
    //ctx.arc(0, 0, this.size, 0, Math.PI * 2);
  //}

  //drawBodyFill(ctx) {
    //ctx.fillStyle = Bubble.COLOR_BG.value;
    //ctx.fill();
  //}

  //drawBodyStroke(ctx) {
    //ctx.strokeStyle = Bubble.color.value;
    //ctx.stroke();

  //}

  //drawLid(ctx) {
    //ctx.beginPath();
    //ctx.ellipse(0, 0, this.size, this.size * this.progress, 0, 0, Math.PI);
    //ctx.ellipse(0, 0, this.size, this.size * this.progress, 0, Math.PI, 0);
  //}

  //drawLidFill(ctx) {
    //ctx.fillStyle = Bubble.COLOR_BG.value;
    //ctx.fill();
  //}

  //drawLidStroke(ctx) {
    //ctx.strokeStyle = Bubble.color.value;
    //ctx.stroke();
  //}

  //drawEye(ctx) {
    //this.drawLid(ctx);
    //ctx.save();
    //ctx.clip();

    //const angle = Math.atan2(Player.y - this.y, Player.x - this.x);
    //const offsetX = (this.size / 6) * Math.cos(angle);
    //const offsetY = (this.size / 6) * Math.sin(angle);
    //ctx.save();
    //ctx.translate(offsetX, offsetY);
    //ctx.beginPath();
    //ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);

  //}

  //drawEyeFill(ctx) {
    //ctx.fillStyle = Bubble.backgroundColor.value;
    //if (this.flash) {
      //ctx.fillStyle = Bubble.pupilColor.value;
      //this.flash = false;
    //}

    //ctx.fill();

    //ctx.restore();
    //ctx.restore();
  //}

  //drawEyeStroke(ctx) {
    //ctx.strokeStyle = Bubble.pupilColor.value;
    //ctx.stroke();

    //ctx.restore();
    //ctx.restore();
  //}

  draw(ctx) {
    ctx.fillStyle = Bubble.backgroundColor.value;
    ctx.strokeStyle = Bubble.color.value;

    // eye
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // lid
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size * this.fade, 0, 0, Math.PI);
    ctx.ellipse(this.x, this.y, this.size, this.size * this.fade, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.clip();

    // pupil
    const angle = Math.atan2(Player.y - this.y, Player.x - this.x);
    const offsetX = (this.size / 6) * Math.cos(angle);
    const offsetY = (this.size / 6) * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(this.x + offsetX, this.y + offsetY, this.size / 2, 0, Math.PI * 2);

    if (this.flash) {
      ctx.fillStyle = Bubble.pupilColor.value;
      this.flash = false;
    }
    ctx.strokeStyle = Bubble.pupilColor.value;

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  pop() {
    this.dead = true;
    Bullet.makeBulletsFromBubble(this);
    BubblePop.trigger(this.level);
  }
}

BulletCollision.subscribe(Bubble.killAllActiveBubbles);
