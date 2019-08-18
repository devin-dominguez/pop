import Config from './config';
import Player from './player';
import { lerp } from './utils';
import { BulletCollision } from './events';

export default class Burst {
  static init() {
    Object.assign(Burst, Config.burst);
    Burst.reset();
  }

  static reset() {
    Burst.particles = [];
  }

  static update(dt) {
    Burst.particles.forEach(particle => particle.update(dt));
    Burst.particles = Burst.particles.filter(particle => !particle.dead);
  }

  static draw(ctx) {
    Burst.particles.forEach(particle => particle.draw(ctx));
  }

  static makeBurst() {
    for (let i = 0; i < Burst.amount; i++) {
      Burst.particles.push(new Burst());
    }
  }

  constructor() {
    this.x = Player.x;
    this.y = Player.y;
    this.angle = Math.random() * Math.PI * 2;
    this.vX = Math.cos(this.angle);
    this.vY = Math.sin(this.angle);
    this.speed = lerp(Math.random(), Burst.minSpeed, Burst.maxSpeed);
    this.size = lerp(Math.random(), Burst.minSize, Burst.maxSize);
    this.dead = false;
    this.fade = 1;
  }

  update(dt) {
    const v = this.speed * (this.fade ** 0.25);
    this.x += this.vX * v * dt;
    this.y += this.vY * v * dt;

    if (this.fade > 0) {
      this.fade -= dt / Burst.fadeTime;
    }
    if (this.fade <= 0){
      this.fade = 0;
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.vX * this.size, this.vY * this.size);
    ctx.strokeStyle = Burst.color;
    ctx.globalAlpha = this.fade;
    ctx.fillStyle = Burst.color;
    ctx.stroke();

    ctx.restore();
  }
}

BulletCollision.subscribe(Burst.makeBurst);
