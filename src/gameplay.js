import Field from './field';
import Time from './time';
import Score from './score';
import Bubble from './bubble';
import Bullet from './bullet';
import Player from './player';
import Trail from './trail';
import Burst from './burst';

import {
  GameOver
} from './events';

import HighScore from './highscore';

const Gameplay = {
  init(app) {
    this.app = app;
    this.keys = {};

    Field.reset();
    Player.reset();
    Bubble.reset();
    Bullet.reset();
    Time.reset();
    Score.reset();
    Trail.reset();
    Burst.reset();
  },

  update(dt) {
    if (Time.slow) {
      dt /= Time.slowFactor;
    }

    Player.update(dt, this.keys);
    Trail.update(dt);
    Burst.update(dt);
    Bubble.update(dt);
    Bullet.update(dt);
    Time.update(dt, this.keys);
    Score.update(dt);
  },

  transformToFitCanvas(ctx) {
    const paddingX = 50;
    const paddingY = 50;
    const width = Field.width + (paddingX * 2) + Time.containerWidth + 20;
    const height = Field.height + (paddingY * 2) + (Score.size * 2);

    let scale = 1;

    const aspect = width / height;
    const targetAspect = this.app.width / this.app.height;
    if (aspect > targetAspect) {
      const newHeight = this.app.width / aspect;
      scale = newHeight / height;
    } else {
      const newWidth= this.app.height * aspect;
      scale = newWidth / width;
    }

    const offsetX = (this.app.width / 2) - (width / 2) - paddingX - (20 + Time.containerWidth);
    const offsetY = (this.app.height / 2) - (height / 2) - paddingY + (Score.size * 2);
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
  },

  draw(ctx) {
    ctx.clearRect(0, 0, this.app.width, this.app.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.app.width, this.app.height);

    ctx.save();
    ctx.translate(0.5, 0.5);

    ctx.save();
    this.transformToFitCanvas(ctx);

    Bubble.draw(ctx);
    Trail.draw(ctx);
    Burst.draw(ctx);
    Bullet.draw(ctx);
    Player.draw(ctx);
    Field.draw(ctx);

    ctx.save();
    ctx.translate(0, -Score.size);
    Score.draw(ctx);
    ctx.restore();

    ctx.save();
    ctx.translate(20 + Field.width, 0);
    Time.draw(ctx);
    ctx.restore();

    ctx.restore();
    ctx.restore();
  },

  onKeyDown(key) {
    this.keys[key] = true;
  },

  onKeyUp(key) {
    this.keys[key] = false;
  },

  onGameOver() {
    Gameplay.app.transitionToScene(HighScore);
  }
};

GameOver.subscribe(Gameplay.onGameOver);

export default Gameplay;