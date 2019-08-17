import BaseApp from './base-app';
import Config from './config';
import Time from './time';
import Score from './score';
import Bubble from './bubble';
import Bullet from './bullet';
import Player from './player';
import Trail from './trail';

Object.assign(window, {
  Player,
  Time,
  Config,
  Bubble,
  Bullet,
  Score,
  Trail
});

export default class App extends BaseApp {
  init() {
    Player.init();
    Bubble.init();
    Bullet.init();
    Time.init();
    Score.init();
    Trail.init();
    //this.ctx.globalCompositeOperation = 'xor';
  }

  update(dt, keys) {
    if (Time.slow) {
      dt /= Time.slowFactor;
    }

    Player.update(dt, keys);
    Trail.update(dt);
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

    ctx.strokeStyle = 'red';
    Bubble.draw(ctx);
    Trail.draw(ctx);
    Bullet.draw(ctx);
    Player.draw(ctx);

    ctx.save();
    ctx.translate(0, -20);
    Score.draw(ctx);
    ctx.restore();

    ctx.strokeRect(0, 0, Config.world.width, Config.world.height);
    ctx.translate(20 + Config.world.width, 0);
    Time.draw(ctx);

    ctx.restore();
    ctx.restore();
  }
}
