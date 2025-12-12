const limitMs = 1000;

export class CallbackQueue {
  private queue: (() => void)[];
  private isExecuting: boolean;

  constructor() {
    this.queue = [];
    this.isExecuting = false;
  }

  add(fn: () => void): void {
    this.queue.push(fn);
    if (!this.isExecuting) {
      this.executeNext();
    }
  }

  private executeNext(): void {
    if (this.queue.length === 0) {
      this.isExecuting = false;
      return;
    }

    this.isExecuting = true;
    const fn = this.queue.shift();
    if (fn) {
      fn();
    }

    setTimeout(() => {
      this.executeNext();
    }, limitMs);
  }
}
