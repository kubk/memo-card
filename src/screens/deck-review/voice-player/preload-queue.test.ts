import { describe, expect, it, vi } from "vitest";
import { PreloadQueue } from "./preload-queue.ts";

describe("PreloadQueue", () => {
  it("should execute functions with a delay of 1 second", async () => {
    const preloadQueue = new PreloadQueue();
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();

    preloadQueue.add(mockFn1);
    preloadQueue.add(mockFn2);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(mockFn2).toHaveBeenCalled();
  });

  it("t", async () => {
    const preloadQueue = new PreloadQueue();
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const mockFn3 = vi.fn();
    const mockFn4 = vi.fn();
    const mockFn5 = vi.fn();

    preloadQueue.add(mockFn1);
    preloadQueue.add(mockFn2);
    preloadQueue.add(mockFn3);
    preloadQueue.add(mockFn4);
    preloadQueue.add(mockFn5);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
    expect(mockFn4).not.toHaveBeenCalled();
    expect(mockFn5).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
    expect(mockFn4).not.toHaveBeenCalled();
    expect(mockFn5).not.toHaveBeenCalled();
  });
});
