import Config from './config';
import Time from './time';
import Score from './score';
import Player from './player';
import Field from './field';
import { checkCircularCollision } from './utils';
import {
  BulletCollision,
  WaveClear
} from './events';

const Bullets  = {
  init() {
    Object.assign(this, Config.bullet);
    this.reset();
  },

  reset() {
    this.bullets = [];
    this.pool = [];
    this.freeItems = [];

    for (let i = 0, l = this.poolSize; i < l; i++) {
      const bullet = {idx: i, free: false};
      this.initBullet(bullet);
      this.pool.push(bullet);
      this.freeItems.push(i);
    }
  },

  initBullet(bullet, x = 0, y = 0, vX = 0, vY = 0) {
    bullet.x = x;
    bullet.y = y;
    bullet.vX = vX * this.speed;
    bullet.vY = vY * this.speed;
    bullet.size = this.size;
    bullet.escaped = false;
    bullet.dead = false;
    bullet.fadeTime = this.fadeTime;
    bullet.waveEscape = false;
  },

  addBullet(x, y, vX, vY) {
    const bullet = this.getBulletFromPool();
    if (!bullet) {
      return;
    }
    this.initBullet(bullet, x, y, vX, vY);
    bullet.free = false;

    this.bullets.push(bullet);
  },

  getBulletFromPool() {
    if (this.freeItems.length === 0) {
      return;
    }

    const idx = this.freeItems.pop();
    return this.pool[idx];
  },

  update(dt) {
    const aliveBullets = [];
    for (let i = 0, l = this.bullets.length; i < l; i++) {
      const bullet = this.bullets[i];
      this.updateBullet(bullet, dt);
      if (!bullet.dead) {
        aliveBullets.push(bullet);
      } else {
        bullet.free = true;
        this.freeItems.push(bullet.idx);
      }
    }

    this.bullets = aliveBullets;
  },

  draw(ctx) {
    for (let i = 0, l = this.bullets.length; i < l; i++) {
      //debugger
      const bullet = this.bullets[i];
      this.drawBullet(bullet, ctx);
    }
  },

  killAll() {
    for (let i = 0, l = this.bullets.length; i < l; i++) {
      const bullet = this.bullets[i];
      bullet.dead = true;
    }
  },

  escapeAll() {
    for (let i = 0, l = this.bullets.length; i < l; i++) {
      const bullet = this.bullets[i];
      bullet.escaped = true;
    }
  },

  makeBulletsFromBubble(bubble) {
    const { x, y, level, size } = bubble;
    const bulletCount = level * this.bubbleMultiplier;

    for (let i = 0; i < bulletCount; i++) {
      const direction = (i / bulletCount) * Math.PI * 2;
      const vX = Math.cos(direction);
      const vY = Math.sin(direction);
      this.addBullet(x + vX * size, y + vY * size, vX, vY);
    }
  },

  updateBullet(bullet, dt) {
    bullet.x += bullet.vX * dt;
    bullet.y += bullet.vY * dt;

    const isOutOfBounds = (bullet.x > Field.width) ||
      (bullet.y > Field.height) ||
      (bullet.x < 0) ||
      (bullet.y < 0);
    if (!bullet.escaped && isOutOfBounds) {
      bullet.escaped = true;
      Score.onBulletEscape();
      Time.onBulletEscape();
    }

    if (bullet.escaped) {
      bullet.fadeTime -= dt;
    } else {
      const collision = checkCircularCollision(
        bullet,
        Player.hitboxCollisionCircle
      );
      if (collision) {
        this.killAll();
        BulletCollision.trigger(bullet);
      }
    }

    if (bullet.fadeTime < 0) {
      bullet.fadeTime = 0;
      bullet.dead = true;
    }
  },

  drawBullet(bullet, ctx) {
    const size = bullet.size * (bullet.fadeTime / this.fadeTime);

    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, size, 0, Math.PI * 2);

    ctx.fillStyle = bullet.escaped ? this.escapedColor.value : this.backgroundColor.value;
    ctx.fill();

    if (!bullet.escaped) {
      ctx.strokeStyle =  this.color.value;
      ctx.stroke();
    }
  }
}

WaveClear.subscribe(Bullets.escapeAll.bind(Bullets));

export default Bullets;
