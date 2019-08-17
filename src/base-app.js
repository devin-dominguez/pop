export default class App {
  // user provided functions in subclasses
  // init() {}
  // update(dt) {}
  // draw() {}
  // onExit() {}

  constructor(canvasSelector) {
    this._initializeCanvas(canvasSelector);
    this._shouldExit = false;
    this._keys = {};

    this.shouldResize = true;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  exit() {
    this._shouldExit = true;
    if (typeof this.onExit === 'function') {
      this.onExit();
    }
  }

  _resizeCanvas() {
    const doc = document.documentElement;
    if ((this.width !== doc.clientWidth) ||
      (this.height !== doc.clientHeight)) {
      this.canvas.width = doc.clientWidth;
      this.canvas.height = doc.clientHeight;
    }
  }

  _update(dt) {
    if (this.shouldResize) {
      this._resizeCanvas();
    }

    if (typeof this.update === 'function') {
      this.update(dt, this._keys);
    }

    if (typeof this.draw === 'function') {
      this.draw(this.ctx);
    }
  }

  _initializeCanvas(canvasSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.canvas.tabIndex = 1;
    this._resizeCanvas();

    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('keydown', e => {
      this._keys[e.key] = true;
    });

    this.canvas.addEventListener('keyup', e => {
      this._keys[e.key] = false;
    });
  }
}

