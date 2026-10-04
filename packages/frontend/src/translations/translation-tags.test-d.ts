import { t } from "./t.ts";
import { td } from "./td.tsx";
import type { Translation, TranslationResources } from "./en.ts";
import type { ar } from "./ar.ts";
import type { es } from "./es.ts";
import type { fa } from "./fa.ts";
import type { ptBr } from "./ptBr.ts";
import type { ru } from "./ru.ts";
import type { uk } from "./uk.ts";
import { expectTypeOf, test } from "vitest";

type TagsOf<S extends string> =
  S extends `${string}[${infer Tag}:${string}]${infer Rest}`
    ? Tag | TagsOf<Rest>
    : S extends `${string}[${infer Tag}]${infer Rest}`
      ? Tag | TagsOf<Rest>
      : never;

type KeysWithTags<T> = {
  [K in keyof T]: T[K] extends string
    ? TagsOf<T[K]> extends never
      ? never
      : K
    : never;
}[keyof T];

type MissingTags<T extends Record<keyof Translation, unknown>> = {
  [K in KeysWithTags<Translation>]: TagsOf<Translation[K]> extends TagsOf<
    Extract<T[K], string>
  >
    ? never
    : K;
}[KeysWithTags<Translation>];

type MissingKeys<T> = {
  [K in keyof Translation]: K extends keyof T ? never : K;
}[keyof Translation];

test("all locales include the translation tags used in English", () => {
  expectTypeOf<MissingTags<typeof ru>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof es>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof ar>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof fa>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof ptBr>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof uk>>().toEqualTypeOf<never>();
});

test("all locales include the translation keys used in English", () => {
  expectTypeOf<MissingKeys<typeof ru>>().toEqualTypeOf<never>();
  expectTypeOf<MissingKeys<typeof es>>().toEqualTypeOf<never>();
  expectTypeOf<MissingKeys<typeof ar>>().toEqualTypeOf<never>();
  expectTypeOf<MissingKeys<typeof fa>>().toEqualTypeOf<never>();
  expectTypeOf<MissingKeys<typeof ptBr>>().toEqualTypeOf<never>();
  expectTypeOf<MissingKeys<typeof uk>>().toEqualTypeOf<never>();
});

test("translation calls infer named arguments from their keys", () => {
  expectTypeOf(t("navigation_main")).toEqualTypeOf<string>();
  expectTypeOf(t("navigation_main", "Main")).toEqualTypeOf<string>();
  expectTypeOf(t("encouraging_message")).toEqualTypeOf<string>();
  expectTypeOf(
    t("buy_plan", { title: "Pro", price: "$5" }),
  ).toEqualTypeOf<string>();
  expectTypeOf(t("new_cards_count", { count: 2 })).toEqualTypeOf<string>();

  // @ts-expect-error Parameterized translations require their arguments
  t("buy_plan");
  // @ts-expect-error All named arguments are required
  t("buy_plan", { title: "Pro" });
  // @ts-expect-error Arguments must have the correct types
  t("new_cards_count", { count: "2" });
  // @ts-expect-error Positional arguments are not supported
  t("buy_plan", "Pro", "$5");
  // @ts-expect-error Unknown fields are rejected
  t("buy_plan", { title: "Pro", price: "$5", plan: "Pro" });
  // @ts-expect-error Zero-argument callbacks do not accept parameters
  t("encouraging_message", {});
  // @ts-expect-error String translations only accept a fallback string
  t("navigation_main", { count: 2 });
  // @ts-expect-error Translation keys must exist
  t("missing_translation");
  // @ts-expect-error Rich translations require string entries
  td("buy_plan", {});
});

test("locales match the resource types and callback arguments", () => {
  expectTypeOf<typeof ru>().toExtend<TranslationResources>();
  expectTypeOf<typeof es>().toExtend<TranslationResources>();
  expectTypeOf<typeof ar>().toExtend<TranslationResources>();
  expectTypeOf<typeof fa>().toExtend<TranslationResources>();
  expectTypeOf<typeof ptBr>().toExtend<TranslationResources>();
  expectTypeOf<typeof uk>().toExtend<TranslationResources>();
});
