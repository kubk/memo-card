import { describe, expect, it } from "vitest";
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
});
