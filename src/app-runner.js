export default class AppRunner {
  constructor(app) {
    this._app = app;
    this._pt = 0;
    this._mainLoop = this._mainLoop.bind(this);
  }

  start() {
    if (typeof this._app.init === 'function') {
      this._app.init();
    }

    window.requestAnimationFrame(this._mainLoop);
  }

  _mainLoop(t) {
    if (!this._app.shouldExit) {
      // use t and pt to get dt in ms
      this._app._update((t - this._pt) / 1000);
      this._pt = t;

      window.requestAnimationFrame(this._mainLoop);
    }
  }
}




