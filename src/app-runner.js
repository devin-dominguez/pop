export default class AppRunner {
  constructor(app) {
    this.app = app;
    this.pt = 0;
    this.mainLoop = this.mainLoop.bind(this);
  }

  start() {
    window.requestAnimationFrame(this.mainLoop);
  }


  mainLoop(t) {
    // use t and pt to get dt in ms
    this.app.update((t - this.pt) / 1000);
    this.pt = t;

    window.requestAnimationFrame(this.mainLoop);
  }
}




