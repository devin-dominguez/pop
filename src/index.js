// TODO better colors/themes/auto-color generation/ add color class with lerp
// TODO better bonus indication (eyes look up?)
// TODO change slomo to render active things inert (no points/time)
// TODO fade in eyes on new wave
// TODO field animation (rays, stars, something better?)
// TODO add more text stuff (sinus?)
// TODO add wave and bonus indicators to score
// TODO add layout stuff to config and make look better
// TODO make non-gameplay scenes look nicer
// TODO refactor bubbleto handle countdown timing better
// TODO optimize (OBJECT POOLS)
// TODO add midi/audio events
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
