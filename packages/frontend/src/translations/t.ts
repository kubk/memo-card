import type { LanguageShared } from "api";
import { userStore } from "../store/user-store.ts";
import type {
  Translation,
  TranslationArguments,
  TranslationKeyByValue,
} from "./en.ts";
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
export type StringTranslationKey = TranslationKeyByValue<string>;

export const translateCategory = (category: string) => {
  return t(`category_${category}` as any, category);
};

export function getActiveLanguage(): LanguageShared {
  return normalizeLanguage(userStore.language);
}

export function t(key: StringTranslationKey, defaultValue?: string): string;
export function t<K extends TranslationKey>(
  key: K,
  ...args: TranslationArguments<NoInfer<K>>
): string;
export function t(key: TranslationKey, ...args: unknown[]): string {
  return translationResourceStore.translate(
    getActiveLanguage(),
    key,
    ...(args as TranslationArguments<TranslationKey>),
  );
}
