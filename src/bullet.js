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
    Bullet.bullets.forEach(bullet => bullet.update(dt));
    Bullet.bullets = Bullet.bullets.filter(bullet => !bullet.dead);
  }

  static draw(ctx) {
    Bullet.bullets.forEach(bullet => bullet.draw(ctx));
  }

  static killAll() {
    Bullet.bullets.forEach(bullet => bullet.dead = true);
  }

  static escapeAll() {
    Bullet.bullets.forEach(bullet => bullet.escaped = true);
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
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.escaped = false;
    this.dead = false;
    this.fadeTime = Bullet.fadeTime;
  }

  update(dt) {
    const {vX, vY, escaped} = this;
    this.x += vX * Bullet.speed * dt;
    this.y += vY * Bullet.speed * dt;

    if (this.isOutOfBounds && !escaped) {
      this.escaped = true;
      Score.onBulletEscape();
      Time.onBulletEscape();
    }

    if (this.escaped) {
      this.fadeTime -= dt;
    } else {
      const collision = checkCircularCollision(
        this.collisionCircle,
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
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    const size = Bullet.size * (this.fadeTime / Bullet.fadeTime);
    ctx.arc(0, 0, size, 0, Math.PI * 2);

    ctx.strokeStyle =  Bullet.color;
    ctx.fillStyle =  Bullet.escapedColor;
    this.escaped ? ctx.fill() : ctx.stroke();

    ctx.restore();
  }

  get collisionCircle() {
    return {
      x: this.x,
      y: this.y,
      size: Bullet.size
    };
  }

  get isOutOfBounds() {
    return (this.x > Field.width) ||
      (this.y > Field.height) ||
      (this.x < 0) ||
      (this.y < 0);
  }
}

WaveClear.subscribe(Bullet.escapeAll);
