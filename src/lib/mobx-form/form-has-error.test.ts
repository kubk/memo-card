import { expect, test } from "vitest";
import { BooleanField, TextField } from "./mobx-form.ts";
import { isFormEmpty, isFormTouched, isFormValid } from "./form-has-error.ts";
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

test("is form dirty", () => {
  const f = {
    a: new TextField("a", validators.required()),
    b: [new TextField("b", validators.required()), new TextField("d")],
  };

  expect(isFormTouched(f)).toBeFalsy();

  f.a.onChange("");
  expect(isFormTouched(f)).toBeTruthy();
});

test("is boolean form dirty", () => {
  const f = {
    a: new BooleanField(false),
  };

  expect(isFormTouched(f)).toBeFalsy();

  f.a.toggle();
  expect(isFormTouched(f)).toBeTruthy();
});

test("is form empty", () => {
  const f = {
    a: new TextField("a", validators.required()),
    b: [new TextField("b", validators.required()), new TextField("d")],
  };

  expect(isFormEmpty(f)).toBeFalsy();

  f.a.onChange("");
  f.b[0].onChange("");
  expect(isFormEmpty(f)).toBeFalsy();

  f.b[1].onChange("");
  expect(isFormEmpty(f)).toBeTruthy();
});
