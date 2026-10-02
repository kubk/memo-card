import type { Translation } from "./en.ts";
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

type MissingTags<T extends Record<string, string>> = {
  [K in KeysWithTags<Translation>]: TagsOf<Translation[K]> extends TagsOf<T[K]>
    ? never
    : K;
}[KeysWithTags<Translation>];

test("all locales include the translation tags used in English", () => {
  expectTypeOf<MissingTags<typeof ru>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof es>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof ar>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof fa>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof ptBr>>().toEqualTypeOf<never>();
  expectTypeOf<MissingTags<typeof uk>>().toEqualTypeOf<never>();
});
