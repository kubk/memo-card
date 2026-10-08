import { action, autorun, observable } from "mobx";
import { ru } from "./ru.ts";
import { describe, expect, it, vi } from "vitest";
import { en, type TranslationResources } from "./en.ts";
import {
  TranslationResourceStore,
  type TranslationLoaders,
} from "./translation-resource-store.ts";

function createLoaders(loader: () => Promise<TranslationResources>) {
  return {
    en: loader,
    ru: loader,
    es: loader,
    "pt-br": loader,
    ar: loader,
    fa: loader,
    uk: loader,
  } satisfies TranslationLoaders;
}

describe("TranslationResourceStore", () => {
  it("exposes copy only after the translation is loaded", async () => {
    const loadedTranslation = {
      ...en,
      review_again: "Loaded review label",
    };
    const store = new TranslationResourceStore(
      createLoaders(async () => loadedTranslation),
    );

    expect(store.translate("ru", "my_decks")).toBe("my_decks");
    expect(store.translate("ru", "review_again")).toBe("review_again");

    await store.load("ru");

    expect(store.translate("ru", "review_again")).toBe("Loaded review label");
  });

  it("deduplicates concurrent loads for one language", async () => {
    let finishLoading:
      | ((translation: TranslationResources) => void)
      | undefined;
    const loader = vi.fn(
      () =>
        new Promise<TranslationResources>((resolve) => {
          finishLoading = resolve;
        }),
    );
    const store = new TranslationResourceStore(createLoaders(loader));

    const firstLoad = store.load("es");
    const secondLoad = store.load("es");

    expect(loader).toHaveBeenCalledTimes(1);

    finishLoading?.(en);
    await Promise.all([firstLoad, secondLoad]);

    expect(store.translate("es", "review_again")).toBe(en.review_again);
  });

  it("uses an explicit fallback before copy is loaded", () => {
    const store = new TranslationResourceStore(createLoaders(async () => en));

    expect(store.translate("uk", "review_again", "Try again")).toBe(
      "Try again",
    );
  });
});

describe("callback translations", () => {
  it("invokes callbacks with named arguments and the selected locale", async () => {
    const store = new TranslationResourceStore({
      ...createLoaders(async () => en),
      ru: async () => ru,
    });
    await Promise.all([store.load("en"), store.load("ru")]);
    expect(store.translate("en", "upgrade_pro")).toBe("Buy Pro");
    expect(store.translate("ru", "upgrade_pro")).toBe("Купить Pro");
    expect(store.translate("ru", "new_cards_count", { count: 21 })).toBe(
      "21 новая карточка",
    );
    expect(store.translate("en", "new_cards_count", { count: 21 })).toBe(
      "21 new cards",
    );
  });

  it("uses the loaded fallback callback's plural rules while another locale is loading", async () => {
    const store = new TranslationResourceStore(createLoaders(async () => ru));
    expect(store.translate("es", "new_cards_count", { count: 21 })).toBe(
      "new_cards_count",
    );
    await store.load("ru");
    expect(store.translate("es", "new_cards_count", { count: 21 })).toBe(
      "21 новая карточка",
    );
  });

  it("reacts to loading and switching locales", async () => {
    const store = new TranslationResourceStore({
      ...createLoaders(async () => en),
      ru: async () => ru,
    });
    const state = observable({ language: "en" as "en" | "ru" });
    const results: string[] = [];
    const dispose = autorun(() => {
      results.push(
        store.translate(state.language, "new_cards_count", { count: 5 }),
      );
    });
    try {
      await store.load("en");
      action(() => {
        state.language = "ru";
      })();
      await store.load("ru");
      expect(results).toEqual([
        "new_cards_count",
        "5 new cards",
        "5 new cards",
        "5 новых карточек",
      ]);
    } finally {
      dispose();
    }
  });

  it("evaluates random messages on each call", async () => {
    const store = new TranslationResourceStore(createLoaders(async () => en));
    await store.load("en");
    const random = vi.spyOn(Math, "random");
    try {
      random.mockReturnValueOnce(0).mockReturnValueOnce(0.99);
      const first = store.translate("en", "encouraging_message");
      const second = store.translate("en", "encouraging_message");
      expect(first).not.toBe(second);
      expect(random).toHaveBeenCalledTimes(2);
    } finally {
      random.mockRestore();
    }
  });
});
