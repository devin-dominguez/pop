import Title from './title';
import Score from './score';
import { drawString } from './text';

const HighScore = {
  init(app) {
    this.app = app;
  },

  draw(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.app.width, this.app.height);
    let scoreString = Score.score.toString();
    let highScoreString = Score.highScore.toString();

    const dLength = Math.abs(scoreString.length - highScoreString.length);
    let padding = '';
    for (let i = 0; i < dLength; i++) {
      padding += ' ';
    }

    if (scoreString.length > highScoreString.length) {
      highScoreString = padding + highScoreString;
    } else {
      scoreString = padding + scoreString
    }

    scoreString = 'Score ' + scoreString;
    highScoreString = ' Best ' + highScoreString;

    ctx.strokeStyle = 'red';
    drawString(ctx, scoreString, 60, 60, 20);
    drawString(ctx, highScoreString, 60, 120, 20);
  },

  onKeyDown(key) {
    switch(key) {
      case 'z':
      case 'Z':
        this.app.transitionToScene(Title);
        break;
    }
  }
};

export default HighScore;
