import type { LanguageShared } from "api";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { userStore } from "../store/user-store.ts";
import type { TranslationStrings } from "./en.ts";
import { normalizeLanguage } from "./normalize-language.ts";

type TranslationLoader = () => Promise<TranslationStrings>;
export type TranslationLoaders = Record<LanguageShared, TranslationLoader>;

export class TranslationResourceStore {
  loadedTranslations: Partial<Record<LanguageShared, TranslationStrings>> = {};
  private fallbackTranslation?: TranslationStrings;
  private loadingTranslations = new Map<
    LanguageShared,
    Promise<TranslationStrings>
  >();
  private initialTranslationLoad?: Promise<void>;

  constructor(private loaders: TranslationLoaders) {
    makeAutoObservable<
      TranslationResourceStore,
      | "fallbackTranslation"
      | "initialTranslationLoad"
      | "loaders"
      | "loadingTranslations"
    >(
      this,
      {
        fallbackTranslation: true,
        initialTranslationLoad: false,
        loaders: false,
        loadingTranslations: false,
      },
      { autoBind: true },
    );
  }

  initialize() {
    if (this.initialTranslationLoad) {
      return this.initialTranslationLoad;
    }

    this.initialTranslationLoad = this.load(this.languageNormalized);
    reaction(
      () => this.languageNormalized,
      (language) => {
        this.load(language).catch((error) => {
          console.error("Failed to load translations", { language, error });
        });
      },
    );

    return this.initialTranslationLoad;
  }

  translate(
    language: LanguageShared,
    key: keyof TranslationStrings,
    defaultValue?: string,
  ) {
    return (
      this.loadedTranslations[language]?.[key] ??
      this.fallbackTranslation?.[key] ??
      defaultValue ??
      key
    );
  }

  async load(language: LanguageShared) {
    if (this.loadedTranslations[language] !== undefined) {
      return;
    }

    let loadingTranslation = this.loadingTranslations.get(language);

    if (!loadingTranslation) {
      loadingTranslation = this.loaders[language]();
      this.loadingTranslations.set(language, loadingTranslation);
    }

    try {
      const translation = await loadingTranslation;

      runInAction(() => {
        this.loadedTranslations[language] = translation;
        if (!this.fallbackTranslation || language === this.languageNormalized) {
          this.fallbackTranslation = translation;
        }
      });
    } finally {
      this.loadingTranslations.delete(language);
    }
  }

  private get languageNormalized() {
    return normalizeLanguage(userStore.language);
  }
}
