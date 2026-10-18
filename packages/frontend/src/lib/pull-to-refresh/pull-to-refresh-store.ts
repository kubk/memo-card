import { makeAutoObservable, observableShallow, runInAction } from "mobx";

export const pullToRefreshThreshold = 60;
const refreshingOffset = 52;
const minRefreshDuration = 500;
const rubberBandDimension = 600;
const rubberBandCoefficient = 0.55;

type PullToRefreshOptions = {
  refresh: () => Promise<unknown>;
  isAvailable: () => boolean;
  getScreenKey: () => string | number;
  onThresholdReached?: () => void;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class PullToRefreshStore {
  enabledChecks: Array<() => boolean> = [];
  pullDistance = 0;
  isPulling = false;
  refreshingScreenKey: string | number | null = null;

  constructor(private options: PullToRefreshOptions) {
    makeAutoObservable<this, "options">(
      this,
      // Deep observable arrays wrap functions, which breaks disable lookups
      { options: false, enabledChecks: observableShallow },
      { autoBind: true },
    );
  }

  get isAvailable() {
    return (
      this.enabledChecks.some((isEnabled) => isEnabled()) &&
      this.options.isAvailable()
    );
  }

  get isRefreshing() {
    return this.refreshingScreenKey === this.options.getScreenKey();
  }

  get isThresholdReached() {
    return this.pullDistance >= pullToRefreshThreshold;
  }

  get contentOffset() {
    return this.isRefreshing ? refreshingOffset : this.pullDistance;
  }

  get progress() {
    return Math.min(this.contentOffset / pullToRefreshThreshold, 1);
  }

  enable(isEnabled: () => boolean = () => true) {
    this.enabledChecks.push(isEnabled);

    return () => {
      this.disable(isEnabled);
    };
  }

  disable(isEnabled: () => boolean) {
    this.enabledChecks = this.enabledChecks.filter(
      (check) => check !== isEnabled,
    );
  }

  startPull() {
    this.isPulling = true;
    this.pullDistance = 0;
  }

  movePull(fingerDistance: number) {
    const wasThresholdReached = this.isThresholdReached;
    const distance = Math.max(0, fingerDistance);
    this.pullDistance =
      (1 - 1 / ((distance * rubberBandCoefficient) / rubberBandDimension + 1)) *
      rubberBandDimension;

    if (!wasThresholdReached && this.isThresholdReached) {
      this.options.onThresholdReached?.();
    }
  }

  endPull() {
    const shouldRefresh = this.isThresholdReached;
    this.isPulling = false;
    this.pullDistance = 0;

    if (shouldRefresh) {
      this.refresh();
    }
  }

  cancelPull() {
    this.isPulling = false;
    this.pullDistance = 0;
  }

  async refresh() {
    if (this.isRefreshing) {
      return;
    }

    const screenKey = this.options.getScreenKey();
    this.refreshingScreenKey = screenKey;

    try {
      await Promise.all([this.options.refresh(), wait(minRefreshDuration)]);
    } finally {
      runInAction(() => {
        if (this.refreshingScreenKey === screenKey) {
          this.refreshingScreenKey = null;
        }
      });
    }
  }
}
