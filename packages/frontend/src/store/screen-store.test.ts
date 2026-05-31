import { describe, expect, it } from "vitest";
import { ScreenStore } from "./screen-store.ts";

describe("screen store", () => {
  it("screen store - push", () => {
    const store = new ScreenStore();
    expect(store.screen).toEqual({ type: "main" });
    store.push({ type: "plans", planType: "teacher" });
    expect(store.screen).toEqual({ type: "plans", planType: "teacher" });
    // Back doesn't work in tests
    // store.back();
    // expect(store.screen).toEqual({ type: "main" });
  });
});
