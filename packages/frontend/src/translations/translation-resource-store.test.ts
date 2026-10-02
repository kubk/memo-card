import { describe, expect, it, vi } from "vitest";
import { en, type TranslationStrings } from "./en.ts";
import {
  TranslationResourceStore,
  type TranslationLoaders,
} from "./translation-resource-store.ts";

function createLoaders(loader: () => Promise<TranslationStrings>) {
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
    let finishLoading: ((translation: TranslationStrings) => void) | undefined;
    const loader = vi.fn(
      () =>
        new Promise<TranslationStrings>((resolve) => {
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
