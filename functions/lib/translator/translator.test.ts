import { expect, test } from "vitest";
import { Translator } from "./translator";

test("Translator - allows to set and retrieve current lang", () => {
  type Translation = {
    hello: string;
  };
  const en: Translation = {
    hello: "Hello!",
  };
  const ru: Translation = {
    hello: "Привет",
  };

  const translations = { en, ru };
  type Language = keyof typeof translations;

  const ts = new Translator<Language, Translation>(translations, "en");

  expect(ts.getLang()).toEqual("en");
  expect(ts.translate("hello")).toBe("Hello!");

  ts.setLang("ru");

  expect(ts.getLang()).toEqual("ru");
  expect(ts.translate("hello")).toBe("Привет");

  expect(ts.isSupported("en")).toBe(true);
  expect(ts.isSupported("asdf")).toBe(false);
});
