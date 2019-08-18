import Gameplay from './gameplay';
import { drawString } from './text';

const Title = {
  init(app) {
    this.app = app;
  },

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.app.width, this.app.height);
    const titleString = 'Pop Game';
    const instructions = 'Press z to start';

    ctx.save();
    ctx.strokeStyle = 'red';
    drawString(ctx, titleString, 60, 60, 20);
    drawString(ctx, instructions, 60, 120, 10);

    ctx.restore();
  },

  onKeyDown(key) {
    switch(key) {
      case 'z':
      case 'Z':
        this.app.transitionToScene(Gameplay);
        break;
    }
  }
};

export default Title;
