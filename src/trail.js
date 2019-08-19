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

    const aliveSegments = [];
    for (let i = 0, l = Trail.segments.length; i < l; i++) {
      const segment = Trail.segments[i];
      segment.update(dt);
      if (!segment.dead) {
        aliveSegments.push(segment);
      }
    }

    Trail.segments = aliveSegments;
  }

  static draw(ctx) {
    ctx.moveTo(Player.x, Player.y);
    ctx.beginPath();

    for (let i = 0, l = Trail.segments.length; i < l; i++) {
      const segment = Trail.segments[i];
      ctx.strokeStyle = Trail.color.scaled(segment.fade);
      ctx.lineTo(segment.x, segment.y);
      ctx.stroke();

      if (i !== Trail.segments.length - 1) {
        ctx.beginPath();
        ctx.moveTo(segment.x, segment.y);
      }
    }
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
