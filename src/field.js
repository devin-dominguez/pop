import Config from './config';
import {
  BulletCollision
} from './events';

export default class Field  {
  static init() {
    Object.assign(Field, Config.field);
    Field.reset();
  }

  static reset() {
    Field.flash = false;
  }

  static draw(ctx) {
    if (Field.flash) {
      Field.flash = false;
      ctx.fillStyle = Field.flashColor;
      ctx.fillRect(0, 0, Field.width, Field.height);
    }

    ctx.strokeStyle = Field.color;
    ctx.strokeRect(0, 0, Field.width, Field.height);
  }

  static onBulletCollision() {
    Field.flash = true;
  }
}

BulletCollision.subscribe(Field.onBulletCollision);
