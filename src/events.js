class Event {
  constructor() {
    this.callbacks = [];
  }

  trigger(...args) {
    this.callbacks.forEach(callback => callback(...args));
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }
}

export const BulletCollision = new Event();
export const BulletEscape = new Event();
export const BubblePop = new Event();
export const WaveClear = new Event();
export const GameOver = new Event();

