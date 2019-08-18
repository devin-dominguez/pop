import BaseApp from './base-app';
import Config from './config';
import Field from './field';
import Time from './time';
import Score from './score';
import Bubble from './bubble';
import Bullet from './bullet';
import Player from './player';
import Trail from './trail';
import Burst from './burst';

Object.assign(window, {
  Player,
  Time,
  Config,
  Bubble,
  Bullet,
  Score,
  Trail,
  Field,
  Burst
});

export default class App extends BaseApp {
  init() {
    Field.init();
    Player.init();
    Bubble.init();
    Bullet.init();
    Time.init();
    Score.init();
    Trail.init();
    Burst.init();
  }

  update(dt, keys) {
    if (Time.slow) {
      dt /= Time.slowFactor;
    }

    Player.update(dt, keys);
    Trail.update(dt);
    Burst.update(dt);
    Bubble.update(dt);
    Bullet.update(dt);
    Time.update(dt, keys);
    Score.update(dt);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(0.5, 0.5);

    ctx.save();
    ctx.translate(60, 60);

    Bubble.draw(ctx);
    Trail.draw(ctx);
    Burst.draw(ctx);
    Bullet.draw(ctx);
    Player.draw(ctx);
    Field.draw(ctx);

    ctx.save();
    ctx.translate(0, -20);
    Score.draw(ctx);
    ctx.restore();

    ctx.save();
    ctx.translate(20 + Field.width, 0);
    Time.draw(ctx);
    ctx.restore();

    ctx.restore();
    ctx.restore();
  }
}
