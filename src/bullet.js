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

export default class Bullet {
  static init() {
    Object.assign(Bullet, Config.bullet);
    Bullet.reset();
  }

  static reset() {
    Bullet.bullets = [];
  }

  static update(dt) {
    const aliveBullets = [];
    for (let i = 0, l = Bullet.bullets.length; i < l; i++) {
      const bullet = Bullet.bullets[i];
      bullet.update(dt);
      if (!bullet.dead) {
        aliveBullets.push(bullet);
      }
    }

    Bullet.bullets = aliveBullets;
  }

  static draw(ctx) {
    for (let i = 0, l = Bullet.bullets.length; i < l; i++) {
      const bullet = Bullet.bullets[i];
      bullet.draw(ctx);
    }
  }

  static killAll() {
    for (let i = 0, l = Bullet.bullets.length; i < l; i++) {
      const bullet = Bullet.bullets[i];
      bullet.dead = true;
    }
  }

  static escapeAll() {
    for (let i = 0, l = Bullet.bullets.length; i < l; i++) {
      const bullet = Bullet.bullets[i];
      bullet.escaped = true;
    }
  }

  static makeBulletsFromBubble(bubble) {
    const { x, y, level, size } = bubble;
    const bulletCount = level * Bullet.bubbleMultiplier;

    for (let i = 0; i < bulletCount; i++) {
      const direction = (i / bulletCount) * Math.PI * 2;
      const vX = Math.cos(direction);
      const vY = Math.sin(direction);
      Bullet.bullets.push(new Bullet(
        x + vX * size,
        y + vY * size,
        vX,
        vY
      ));
    }
  }

  constructor(x, y, vX, vY) {
    this.size = Bullet.size;
    this.x = x;
    this.y = y;
    this.vX = vX * Bullet.speed;
    this.vY = vY * Bullet.speed;
    this.escaped = false;
    this.dead = false;
    this.fadeTime = Bullet.fadeTime;
    this.waveEscape = false;
  }

  update(dt) {
    this.x += this.vX * dt;
    this.y += this.vY * dt;

    if (!this.escaped && this.isOutOfBounds) {
      this.escaped = true;
      Score.onBulletEscape();
      Time.onBulletEscape();
    }

    if (this.escaped) {
      this.fadeTime -= dt;
    } else {
      const collision = checkCircularCollision(
        this,
        Player.hitboxCollisionCircle
      );
      if (collision) {
        Bullet.killAll();
        BulletCollision.trigger(this);
      }
    }

    if (this.fadeTime < 0) {
      this.fadeTime = 0;
      this.dead = true;
    }
  }

  draw(ctx) {
    const size = this.size * (this.fadeTime / Bullet.fadeTime);

    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);

    ctx.fillStyle = this.escaped ? Bullet.escapedColor : Bullet.backgroundColor;
    ctx.fill();

    if (!this.escaped) {
      ctx.strokeStyle =  Bullet.color;
      ctx.stroke();
    }
  }

  get isOutOfBounds() {
    return (this.x > Field.width) ||
      (this.y > Field.height) ||
      (this.x < 0) ||
      (this.y < 0);
  }
}

WaveClear.subscribe(Bullet.escapeAll);
