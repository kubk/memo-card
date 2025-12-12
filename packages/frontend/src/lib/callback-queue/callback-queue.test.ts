import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CallbackQueue } from "./callback-queue.ts";

describe("CallbackQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should execute functions with a delay of 1 second", async () => {
    const queue = new CallbackQueue();
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();

    queue.add(mockFn1);
    queue.add(mockFn2);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1100);
    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(mockFn2).toHaveBeenCalled();
  });

  it("should execute many functions with a delay", async () => {
    const queue = new CallbackQueue();
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const mockFn3 = vi.fn();
    const mockFn4 = vi.fn();
    const mockFn5 = vi.fn();

    queue.add(mockFn1);
    queue.add(mockFn2);
    queue.add(mockFn3);
    queue.add(mockFn4);
    queue.add(mockFn5);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
    expect(mockFn4).not.toHaveBeenCalled();
    expect(mockFn5).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1100);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
    expect(mockFn4).not.toHaveBeenCalled();
    expect(mockFn5).not.toHaveBeenCalled();
  });
});
