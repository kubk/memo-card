import { expect, test } from "vitest";
import { BooleanField, TextField } from "./mobx-form.ts";
import {
  isFormEmpty,
  isFormTouched,
  isFormTouchedAndValid,
  isFormValid,
} from "./form-has-error.ts";
import { validators } from "./validator.ts";

test("isFormTouchedAndHasError", () => {
  const f1 = {
    a: new TextField("a"),
    b: new TextField("b"),
  };
  expect(isFormValid(f1)).toBeTruthy();
  expect(isFormTouchedAndValid(f1)).toBeFalsy();

  expect(
    isFormValid({
      a: new TextField("a"),
      b: [new TextField("b"), new TextField("d")],
    }),
  ).toBeTruthy();

  const f2 = {
    a: new TextField("a", validators.required()),
    b: [new TextField("b", validators.required()), new TextField("d")],
  };

  f2.a.touch();
  expect(isFormValid(f2)).toBeTruthy();
  expect(isFormTouchedAndValid(f2)).toBeTruthy();

  f2.a.onChange("");
  expect(isFormValid(f2)).toBeFalsy();
  expect(isFormTouchedAndValid(f2)).toBeFalsy();

  f2.a.onChange("smth");
  expect(isFormValid(f2)).toBeTruthy();
  expect(isFormTouchedAndValid(f2)).toBeTruthy();

  f2.b[0].touch();
  expect(isFormTouchedAndValid(f2)).toBeTruthy();

  f2.b[0].onChange("");
  expect(isFormTouchedAndValid(f2)).toBeTruthy();
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

test("is form invalid by default", () => {
  const f = {
    a: new TextField("", validators.required()),
  };

  expect(isFormValid(f)).toBeFalsy();

  f.a.onChange("1");
  expect(isFormValid(f)).toBeTruthy();
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

test('very nested form - only fields', () => {
  const f = {
    a: new TextField("a", validators.required()),
    b: {
      c: {
        d: new TextField("d", validators.required()),
      },
    },
  };

  expect(isFormValid(f)).toBeTruthy();
  expect(isFormTouched(f)).toBeFalsy()

  f.b.c.d.onChange('');

  expect(isFormTouched(f)).toBeTruthy()
  expect(isFormValid(f)).toBeFalsy();
})

test('very nested form - any fields', () => {
  const f = {
    a: new TextField("a", validators.required()),
    num: 12,
    b: {
      c: {
        d: new TextField("d", validators.required()),
        k: null,
      },
    },
  };

  expect(isFormValid(f)).toBeTruthy();
  expect(isFormTouched(f)).toBeFalsy()

  f.b.c.d.onChange('');

  expect(isFormTouched(f)).toBeTruthy()
  expect(isFormValid(f)).toBeFalsy();
})
