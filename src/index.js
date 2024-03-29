// TODO organize file structure
// refactor classes into objects
// refactor module lifecycle
// try blend modes w/ offline canvas
// !!!! draw layers for bubbles
// better colors/themes/auto-color generation/ add color class with lerp
// better bonus indication (eyes look up?)
// backdrop needs to fade out when bonus ends
// change slomo to render active things inert (no points/time)
// fade in eyes on new wave
// add more text stuff (sinus?)
// make score wiggle when high score
// add wave and bonus indicators to score MAYBE
// add layout stuff to config and make look better
// make non-gameplay scenes look nicer
// refactor entities to handle countdown timing better
// optimize (OBJECT POOLS, makewave, etc...)
// make tweak panel
// add midi/audio events
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

const app = new App('#canvas', Title, { alpha: false });
const appRunner = new AppRunner(app);

appRunner.start();
