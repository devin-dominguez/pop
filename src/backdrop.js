import Field from './field';
import Score from './score';
import Time from './time';

export default class Backdrop {
  static init() {
    Backdrop.fade = 0;
    Backdrop.angle = 0;
  }

  static update(dt) {
    Backdrop.angle += dt * (Math.PI / 24);
  }

  static draw(ctx) {
    if (!Time.isBonusTime) {
      return;
    }

    ctx.save();
    ctx.translate(Field.width / 2, Field.height / 2);

    const scale = (Math.max(0, Score.multiplier - Score.minBonusMultiplier)) /
      (Score.maxBonusMultiplier - Score.minBonusMultiplier);
    const rayCount = 8;
    const rayAngle = Math.PI / 24;

    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2 + Backdrop.angle;
      const a1 = angle - rayAngle;
      const a2 = angle + rayAngle;
      const size = Math.max(Field.width, Field.height) * 2;

      const x1 = Math.cos(a1) * size;
      const y1 = Math.sin(a1) * size;

      const x2 = Math.cos(a2) * size;
      const y2 = Math.sin(a2) * size;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(0, 0);
      ctx.lineTo(x2, y2);
      ctx.globalAlpha = (scale ** 4) * 0.125;
      ctx.fillStyle = 'red';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, Field.width / 2, scale * Field.height / 2, 0, 0, Math.PI);
    ctx.ellipse(0, 0, Field.width / 2, scale * Field.height / 2, 0, Math.PI, 0);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.globalAlpha = (scale * scale) * 0.6;
    ctx.stroke();
    ctx.save();
    ctx.clip();

    const size = Math.max(Field.width, Field.height) / 4
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.globalAlpha = (scale * scale) * 0.5;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }
}
