import Config from './config';
import Player from './player';
import Time from './time';
import { lerp } from './utils';

export default class Trail {
  static init() {
    Object.assign(Trail, Config.trail);
    Trail.reset();
  }

  static reset() {
    Trail.segments = [];
    Trail.fadeTime = 1 / Trail.minFadeTime;
  }

  static update(dt) {
    Trail.fadeTime = 1 / lerp(Time.normalized * Time.normalized, Trail.minFadeTime, Trail.maxFadeTime);

    Trail.segments.push(new Trail());

    Trail.segments.forEach(segment => segment.update(dt));
    Trail.segments = Trail.segments.filter(segment => !segment.dead);
  }

  static draw(ctx) {
    ctx.save();

    ctx.strokeStyle = Trail.color;
    ctx.moveTo(Player.x, Player.y);
    ctx.beginPath();

    Trail.segments.forEach((segment, idx) => {
      ctx.globalAlpha = segment.fade;
      ctx.lineTo(segment.x, segment.y);
      ctx.stroke();

      if (idx !== Trail.segments.length - 1) {
        ctx.beginPath();
        ctx.moveTo(segment.x, segment.y);
      }
    })

    ctx.restore();
  }

  constructor() {
    this.x = Player.x;
    this.y = Player.y;
    this.fade = 1;
    this.dead = false;
  }

  update(dt) {
    if (this.fade > 0) {
      this.fade -=  Trail.fadeTime * dt;
    }

    if (this.fade <= 0) {
      this.fade = 0;
      this.dead = true;
    }
  }

}
