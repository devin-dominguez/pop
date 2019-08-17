import App from './app';
import AppRunner from './app-runner';

const app = new App('#canvas');
const appRunner = new AppRunner(app);

appRunner.start();
