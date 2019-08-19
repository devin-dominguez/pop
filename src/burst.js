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
    //const angle = Math.PI + Math.atan2(bullet.y - Player.y, bullet.x - Player.x);
    const baseAngle = Math.PI + Math.atan2(-Player.y, -Player.x);
    for (let i = 0; i < Burst.amount; i++) {
      const offset = Burst.angleRange * (Math.random() * 2 - 1);
      const angle = baseAngle + offset;
      const direction = (i % 2 === 0) ? 0 : Math.PI;

      Burst.particles.push(new Burst(angle + direction));
    }
  }

  constructor(angle) {
    this.x = Player.x;
    this.y = Player.y;
    this.vX = Math.cos(angle);
    this.vY = Math.sin(angle);
    this.speed = lerp(Math.random(), Burst.minSpeed, Burst.maxSpeed);
    this.size = 1 - ((Burst.speed - Burst.minSpeed) / (Burst.maxSpeed - Burst.minSpeed));
    this.dead = false;
    this.fade = 1;
  }

  update(dt) {
    const v = this.speed * (this.fade ** 0.25);
    this.size = 1 - ((v - Burst.minSpeed) / (Burst.maxSpeed - Burst.minSpeed));
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
    const size = lerp(this.size, Burst.minSize, Burst.maxSize);
    ctx.lineTo(this.vX * size, this.vY * size);
    ctx.strokeStyle = Burst.color;
    ctx.globalAlpha = this.fade;
    ctx.fillStyle = Burst.color;
    ctx.stroke();

    ctx.restore();
  }
}

BulletCollision.subscribe(Burst.makeBurst);
