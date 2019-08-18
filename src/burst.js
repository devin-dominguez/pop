import Config from './config';
import Player from './player';
import Time from './time';
import { lerp } from './utils';

export default class Burst {
  static init() {
    Object.assign(Burst, Config.burst);
    Burst.reset();
  }

  static reset() {
    Burst.particles = [];
  }

  static update(dt) {
    if (Time.isBonusTime && Player.isMoving) {
      for (let i = 0; i < Burst.amount; i++) {
        Burst.particles.push(new Burst());
      }
    }

    Burst.particles.forEach(particle => particle.update(dt));
    Burst.particles = Burst.particles.filter(particle => !particle.dead);
  }

  static draw(ctx) {
    Burst.particles.forEach(particle => particle.draw(ctx));
  }

  constructor() {
    this.x = Player.x;
    this.y = Player.y;
    this.angle = Math.atan2(Player.vY, Player.vX);
    const offset = Math.random() * Math.PI * 2;
    this.angle += offset;

    this.speed = lerp(Math.random(), Burst.minSpeed, Burst.maxSpeed);
    // if the player isn't moving then we don't want to deal with it
    this.dead = false;
    this.fade = 1;
  }

  update(dt) {
    const v = this.speed * (this.fade ** 0.25);
    const vX = Math.cos(this.angle) * v;
    const vY = Math.sin(this.angle) * v;
    this.x += vX * dt;
    this.y += vY * dt;

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
    ctx.fillStyle = Burst.color;
    ctx.globalAlpha = this.fade;
    ctx.beginPath();
    ctx.arc(0, 0, Burst.size * this.fade, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
