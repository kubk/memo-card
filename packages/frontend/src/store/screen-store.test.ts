import { describe, expect, it } from "vitest";
import { ScreenStore } from "./screen-store.ts";

describe("screen store", () => {
  it("screen store - push", () => {
    const store = new ScreenStore({ enableUrlSync: false });
    expect(store.screen).toEqual({ type: "main" });
    store.push({ type: "plans", planType: "teacher" });
    expect(store.screen).toEqual({ type: "plans", planType: "teacher" });
    store.back();
    expect(store.screen).toEqual({ type: "main" });
  });

  it("limits the back stack to three steps before main", () => {
    const store = new ScreenStore({ enableUrlSync: false });

    store.push({ type: "deckCatalog" });
    store.push({ type: "plans", planType: "pro" });
    store.push({ type: "userSettings", index: 1 });
    store.push({ type: "about" });

    expect(store.screen).toEqual({ type: "about" });

    store.back();
    expect(store.screen).toEqual({ type: "userSettings", index: 1 });

    store.back();
    expect(store.screen).toEqual({ type: "plans", planType: "pro" });

    store.back();
    expect(store.screen).toEqual({ type: "main" });

    store.back();
    expect(store.screen).toEqual({ type: "main" });
  });

  it("preserves the deck route for card editor shortcuts", () => {
    const store = new ScreenStore({ enableUrlSync: false });

    store.push({ type: "deckForm", deckId: 1 });
    store.push({ type: "cardList", deckId: 1 });
    store.push({ type: "deckForm", deckId: 1, cardId: 2 });

    store.backToDeck(1);

    expect(store.screen).toEqual({ type: "deckForm", deckId: 1 });
  });
});
