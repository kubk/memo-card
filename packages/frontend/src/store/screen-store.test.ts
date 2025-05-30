import { expect, test } from "vitest";
import { ScreenStore } from "./screen-store.ts";

test("screen store - push", () => {
  const store = new ScreenStore();
  expect(store.screen).toEqual({ type: "main" });
  store.go({ type: "plans" });
  expect(store.screen).toEqual({ type: "plans" });
  store.back();
  expect(store.screen).toEqual({ type: "main" });
});

test("screen store - push 1", () => {
  const store = new ScreenStore();
  expect(store.screen).toEqual({ type: "main" });
  store.goOnce({ type: "plans" });
  expect(store.screen).toEqual({ type: "plans" });
  store.go({ type: "deckCatalog" });
  expect(store.screen).toEqual({ type: "deckCatalog" });
  store.back();
  expect(store.screen).toEqual({ type: "main" });
});

test("screen store - push 2", () => {
  const store = new ScreenStore();
  expect(store.screen).toEqual({ type: "main" });
  store.goOnce({ type: "plans" });
  expect(store.screen).toEqual({ type: "plans" });
  store.back();
  expect(store.screen).toEqual({ type: "main" });
});
