import Config from './config';
import Field from './field';
import Score from './score';
import Time from './time';

export default class Backdrop {
  static init() {
    Object.assign(Backdrop, Config.backDrop);
    Backdrop.fade = 0;
    Backdrop.angle = 0;
  }

  static update(dt) {
    Backdrop.angle += dt * Backdrop.rayRotationSpeed;
  }

  static draw(ctx) {
    if (!Time.isBonusTime) {
      return;
    }

    const progress = (Math.max(0, Score.multiplier - Score.minBonusMultiplier)) /
      (Score.maxBonusMultiplier - Score.minBonusMultiplier);
    const sunSize = Field.width * Backdrop.widthRatio;
    const rise = progress * Backdrop.riseAmount;
    const offsetX = Field.width / 2;
    const offsetY = Field.height + (sunSize * (1 - rise))

    // clip
    ctx.fillStyle = Backdrop.backgroundColor.value;
    ctx.fillRect(0, 0, Field.width, Field.height);
    ctx.save();
    ctx.clip();

    //rays
    for (let i = 0; i < Backdrop.rayCount; i++) {
      const angle = (i / Backdrop.rayCount) * Math.PI * 2 + Backdrop.angle;
      const size = Math.max(Field.width, Field.height) * 2;

      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.lineTo(offsetX + x, offsetY + y);
      ctx.strokeStyle = Backdrop.color.scaled(progress ** 6);
      ctx.stroke();
    }
    // sun
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, sunSize, 0, Math.PI * 2);

    ctx.strokeStyle = Backdrop.color.scaled(progress);
    ctx.stroke();

    ctx.fillStyle = Backdrop.backgroundColor.value;
    ctx.fill();

    ctx.restore(); // clip

  }
}
