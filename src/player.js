import Config from './config';
import { constrain } from './utils';

export default class Player {
  static init() {
    Object.assign(Player, Config.player);

    Player.x = Config.world.width / 2;
    Player.y = Config.world.height / 2;
    Player.vX = 0;
    Player.vY = 0;
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
    Player.x = constrain(Player.x, 0, Config.world.width);
    Player.y = constrain(Player.y, 0, Config.world.height);
  }

  static draw(ctx) {
    ctx.save();
    ctx.translate(Player.x, Player.y);

    ctx.strokeStyle = Player.triggerColor;
    ctx.beginPath();
    ctx.arc(0, 0, Player.size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = Player.hitboxColor;
    ctx.beginPath();
    ctx.arc(0, 0, Player.hitboxSize, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static get targetCollisionCircle() {
    return {
      x: Player.x,
      y: Player.y,
      size: Player.size
    };
  }

  static get hitboxCollisionCircle() {
    return {
      x: Player.x,
      y: Player.y,
      size: Player.hitboxSize
    };
  }
}

