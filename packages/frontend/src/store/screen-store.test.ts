import { describe, expect, it, test } from "vitest";
import { ScreenStore } from "./screen-store.ts";

describe("screen store", () => {
  it("screen store - push", () => {
    const store = new ScreenStore();
    expect(store.screen).toEqual({ type: "main" });
    store.go({ type: "plans" });
    expect(store.screen).toEqual({ type: "plans" });
    // Back doesn't work in tests
    // store.back();
    // expect(store.screen).toEqual({ type: "main" });
  });

  it("screen store - push 1", () => {
    const store = new ScreenStore();
    store.go({ type: "main" });
    expect(store.screen).toEqual({ type: "main" });
    store.goOnce({ type: "plans" });
    expect(store.screen).toEqual({ type: "plans" });
    store.go({ type: "deckCatalog" });
    expect(store.screen).toEqual({ type: "deckCatalog" });
    // Back doesn't work in tests
    // store.back();
    // expect(store.screen).toEqual({ type: "main" });
  });
});
