import App from './app';
import AppRunner from './app-runner';

import Field from './field';
import Time from './time';
import Score from './score';
import Bubble from './bubble';
import Bullet from './bullet';
import Player from './player';
import Trail from './trail';
import Burst from './burst';

import Title from './title';

Field.init();
Time.init();
Score.init();
Bubble.init();
Bullet.init();
Player.init();
Trail.init();
Burst.init();

const app = new App('#canvas', Title);
const appRunner = new AppRunner(app);

appRunner.start();
