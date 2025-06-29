import { Translator } from "api";
import { userStore } from "../store/user-store.ts";
import { LanguageShared } from "api";
import { en, Translation } from "./en.ts";
import { ru } from "./ru.ts";
import { es } from "./es.ts";
import { ptBr } from "./ptBr.ts";
import { ar } from "./ar.ts";
import { fa } from "./fa.ts";
import { uk } from "./uk.ts";

const translations = { en, ru, es, "pt-br": ptBr, ar, fa, uk };

export const isLanguage = (lang?: string | null): lang is LanguageShared => {
  return lang ? lang in translations : false;
};

export const translateCategory = (category: string) => {
  return t(`category_${category}` as any, category);
};

export const translator = new Translator<LanguageShared, Translation>(
  translations,
  () => {
    const language = userStore.language;
    return isLanguage(language) ? language : "en";
  },
);

export const t = (key: keyof Translation, defaultValue?: string) => {
  return translator.translate(key, defaultValue);
};
