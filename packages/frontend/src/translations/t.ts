import type { LanguageShared } from "api";
import { userStore } from "../store/user-store.ts";
import type { Translation } from "./en.ts";
import { normalizeLanguage } from "./normalize-language.ts";
import {
  TranslationResourceStore,
  type TranslationLoaders,
} from "./translation-resource-store.ts";

const fullTranslationLoaders = {
  en: () => import("./en.ts").then(({ en }) => en),
  ru: () => import("./ru.ts").then(({ ru }) => ru),
  es: () => import("./es.ts").then(({ es }) => es),
  "pt-br": () => import("./ptBr.ts").then(({ ptBr }) => ptBr),
  ar: () => import("./ar.ts").then(({ ar }) => ar),
  fa: () => import("./fa.ts").then(({ fa }) => fa),
  uk: () => import("./uk.ts").then(({ uk }) => uk),
} satisfies TranslationLoaders;

export const translationResourceStore = new TranslationResourceStore(
  fullTranslationLoaders,
);

export type TranslationKey = keyof Translation;

export const translateCategory = (category: string) => {
  return t(`category_${category}` as any, category);
};

function getActiveLanguage(): LanguageShared {
  return normalizeLanguage(userStore.language);
}

export const translator = {
  getLang: getActiveLanguage,
  translate(key: TranslationKey, defaultValue?: string) {
    return translationResourceStore.translate(
      getActiveLanguage(),
      key,
      defaultValue,
    );
  },
};

export const t = (key: TranslationKey, defaultValue?: string) => {
  return translator.translate(key, defaultValue);
};
