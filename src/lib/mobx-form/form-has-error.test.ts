import { expect, test } from "vitest";
import { TextField } from "./mobx-form.ts";
import { isFormValid } from "./form-has-error.ts";
import { validators } from "./validator.ts";

test("isFormTouchedAndHasError", () => {
  expect(
    isFormValid({
      a: new TextField("a"),
      b: new TextField("b"),
    }),
  ).toBeTruthy();

  expect(
    isFormValid({
      a: new TextField("a"),
      b: [new TextField("b"), new TextField("d")],
    }),
  ).toBeTruthy();

  const f = {
    a: new TextField("a", validators.required()),
    b: [new TextField("b", validators.required()), new TextField("d")],
  };

  f.a.touch();
  expect(isFormValid(f)).toBeTruthy();

  f.a.onChange("");
  expect(isFormValid(f)).toBeFalsy();

  f.a.onChange("smth");
  expect(isFormValid(f)).toBeTruthy();

  f.b[0].touch();
  expect(isFormValid(f)).toBeTruthy();

  f.b[0].onChange("");
  expect(isFormValid(f)).toBeFalsy();
});
