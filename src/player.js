import Config from './config';
import Field from './field';
import { constrain } from './utils';

export default class Player {
  static init() {
    Object.assign(Player, Config.player);
    Player.reset();
  }

  static reset() {
    Player.x = Field.width / 2;
    Player.y = Field.height / 2;
    Player.vX = 0;
    Player.vY = 0;

    Player.hitboxCollisionCircle = {
      x: Player.x,
      y: Player.y,
      size: Player.hitboxSize
    };
  }

  static update(dt, keys) {
     Player.vX = 0;
     Player.vY = 0;

    if (keys.ArrowUp) {
      Player.vY = -1;
    }
    if (keys.ArrowDown) {
      Player.vY = 1;
    }
    if (keys.ArrowLeft) {
      Player.vX = -1;
    }
    if (keys.ArrowRight) {
      Player.vX = 1;
    }

    // treating dX and dY as a bobo normalized vector
    let dX = Player.vX;
    let dY = Player.vY;
    if ((Player.vX !== 0) && (Player.vY !== 0)) {
      dX *= 0.7071067811865476;
      dY *= 0.7071067811865476;
    }

    Player.x += dX * dt * Player.speed;
    Player.y += dY * dt * Player.speed;
    Player.x = constrain(Player.x, 0, Field.width);
    Player.y = constrain(Player.y, 0, Field.height);

    Player.hitboxCollisionCircle.x = Player.x;
    Player.hitboxCollisionCircle.y = Player.y;
  }

  static draw(ctx) {
    ctx.beginPath();
    ctx.arc(Player.x, Player.y, Player.size, 0, Math.PI * 2);
    ctx.strokeStyle = Player.triggerColor.value;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(Player.x, Player.y, Player.hitboxSize, 0, Math.PI * 2);
    ctx.strokeStyle = Player.hitboxColor.value;
    ctx.stroke();
  }
}

