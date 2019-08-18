export default class App {
  constructor(canvasSelector, initialScene) {
    this.initializeCanvas(canvasSelector);
    this.keys = {};

    this.shouldResize = true;

    this.transitionToScene(initialScene);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  resizeCanvas() {
    const doc = document.documentElement;
    if ((this.width !== doc.clientWidth) ||
      (this.height !== doc.clientHeight)) {
      this.canvas.width = doc.clientWidth;
      this.canvas.height = doc.clientHeight;
    }
  }

  update(dt) {
    if (this.shouldResize) {
      this.resizeCanvas();
    }
    if (this.currentScene) {
      if (this.currentScene.update) {
        this.currentScene.update(dt, this.keys);
      }
      if (this.currentScene.draw) {
        this.currentScene.draw(this.ctx);
      }
    }
  }

  transitionToScene(scene) {
    if (this.currentScene && this.currentScene.exit) {
      this.currentScene.exits(scene);
    }
    this.currentScene = scene;
    if (this.currentScene.init) {
      this.currentScene.init(this);
    }
  }

  onKeyDown(key) {
    if (this.currentScene.onKeyDown) {
      this.currentScene.onKeyDown(key);
    }
  }

  onKeyUp(key) {
    if (this.currentScene.onKeyUp) {
      this.currentScene.onKeyUp(key);
    }
  }

  initializeCanvas(canvasSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.canvas.tabIndex = 1;
    this.resizeCanvas();

    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('keydown', e => this.onKeyDown(e.key));
    this.canvas.addEventListener('keyup', e => this.onKeyUp(e.key));
  }
}

