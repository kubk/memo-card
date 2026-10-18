import { observable, runInAction } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PullToRefreshStore,
  pullToRefreshThreshold,
} from "./pull-to-refresh-store.ts";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function createStore() {
  const env = {
    isAvailable: true,
    screenKey: 1,
    refresh: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
    onThresholdReached: vi.fn(),
  };
  const store = new PullToRefreshStore({
    refresh: env.refresh,
    isAvailable: () => env.isAvailable,
    getScreenKey: () => env.screenKey,
    onThresholdReached: env.onThresholdReached,
  });

  return { env, store };
}

describe("PullToRefreshStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is available only while a screen enables it", () => {
    const { env, store } = createStore();
    expect(store.isAvailable).toBe(false);

    const disable = store.enable();
    expect(store.isAvailable).toBe(true);

    env.isAvailable = false;
    expect(store.isAvailable).toBe(false);
    env.isAvailable = true;

    disable();
    expect(store.isAvailable).toBe(false);
  });

  it("follows the screen condition", () => {
    const { store } = createStore();
    const screen = observable({ isSelecting: false });
    store.enable(() => !screen.isSelecting);
    expect(store.isAvailable).toBe(true);

    runInAction(() => {
      screen.isSelecting = true;
    });
    expect(store.isAvailable).toBe(false);
  });

  it("resists the pull and reaches the threshold once", () => {
    const { env, store } = createStore();
    store.startPull();

    store.movePull(60);
    expect(store.pullDistance).toBeGreaterThan(0);
    expect(store.pullDistance).toBeLessThan(60);
    expect(store.isThresholdReached).toBe(false);

    store.movePull(200);
    store.movePull(220);
    expect(store.isThresholdReached).toBe(true);
    expect(store.progress).toBe(1);
    expect(env.onThresholdReached).toHaveBeenCalledTimes(1);

    store.movePull(-20);
    expect(store.pullDistance).toBe(0);
  });

  it("springs back without refreshing when released below the threshold", () => {
    const { env, store } = createStore();
    store.startPull();
    store.movePull(40);

    store.endPull();

    expect(store.isPulling).toBe(false);
    expect(store.contentOffset).toBe(0);
    expect(store.isRefreshing).toBe(false);
    expect(env.refresh).not.toHaveBeenCalled();
  });

  it("holds the content until the refresh finishes", async () => {
    const { env, store } = createStore();
    const refresh = deferred();
    env.refresh.mockReturnValue(refresh.promise);
    store.startPull();
    store.movePull(400);
    expect(store.pullDistance).toBeGreaterThanOrEqual(pullToRefreshThreshold);

    store.endPull();

    expect(env.refresh).toHaveBeenCalledTimes(1);
    expect(store.isRefreshing).toBe(true);
    expect(store.contentOffset).toBeGreaterThan(0);

    await vi.runAllTimersAsync();
    expect(store.isRefreshing).toBe(true);

    refresh.resolve();
    await vi.runAllTimersAsync();
    expect(store.isRefreshing).toBe(false);
    expect(store.contentOffset).toBe(0);
  });

  it("keeps the spinner for a minimum duration", async () => {
    const { store } = createStore();

    store.refresh();
    await vi.advanceTimersByTimeAsync(100);
    expect(store.isRefreshing).toBe(true);

    await vi.runAllTimersAsync();
    expect(store.isRefreshing).toBe(false);
  });

  it("ignores a second refresh while the screen is refreshing", async () => {
    const { env, store } = createStore();

    store.refresh();
    store.refresh();
    await vi.runAllTimersAsync();

    expect(env.refresh).toHaveBeenCalledTimes(1);
  });

  it("does not show the refresh on another screen", async () => {
    const { env, store } = createStore();
    const refresh = deferred();
    env.refresh.mockReturnValue(refresh.promise);

    store.refresh();
    env.screenKey = 2;

    expect(store.isRefreshing).toBe(false);
    expect(store.contentOffset).toBe(0);

    env.screenKey = 1;
    expect(store.isRefreshing).toBe(true);

    refresh.resolve();
    await vi.runAllTimersAsync();
    expect(store.isRefreshing).toBe(false);
  });
});
