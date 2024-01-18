import { expect, test } from "vitest";
import { TextField } from "./text-field.ts";
import {
  formTouchAll,
  formUnTouchAll,
  isFormEmpty,
  isFormTouched,
  isFormTouchedAndValid,
  isFormValid,
} from "./form.ts";
import { validators } from "./validator.ts";
import { BooleanField } from "./boolean-field.ts";
import { ListField } from "./list-field.ts";

const isRequiredMessage = "is required";

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
    a: new TextField("a", validators.required(isRequiredMessage)),
    b: [
      new TextField("b", validators.required(isRequiredMessage)),
      new TextField("d"),
    ],
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
    a: new TextField("a", validators.required(isRequiredMessage)),
    b: [
      new TextField("b", validators.required(isRequiredMessage)),
      new TextField("d"),
    ],
  };

  expect(isFormTouched(f)).toBeFalsy();

  f.a.onChange("");
  expect(isFormTouched(f)).toBeTruthy();
});

test("is form invalid by default", () => {
  const f = {
    a: new TextField("", validators.required(isRequiredMessage)),
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
    a: new TextField("a", validators.required(isRequiredMessage)),
    b: [
      new TextField("b", validators.required(isRequiredMessage)),
      new TextField("d"),
    ],
  };

  expect(isFormEmpty(f)).toBeFalsy();

  f.a.onChange("");
  f.b[0].onChange("");
  expect(isFormEmpty(f)).toBeFalsy();

  f.b[1].onChange("");
  expect(isFormEmpty(f)).toBeTruthy();
});

test("very nested form - only fields", () => {
  const f = {
    a: new TextField("a", validators.required(isRequiredMessage)),
    b: {
      c: {
        d: new TextField("d", validators.required(isRequiredMessage)),
      },
    },
  };

  expect(isFormValid(f)).toBeTruthy();
  expect(isFormTouched(f)).toBeFalsy();

  f.b.c.d.onChange("");

  expect(isFormTouched(f)).toBeTruthy();
  expect(isFormValid(f)).toBeFalsy();
});

test("very nested form - any fields", () => {
  const f = {
    a: new TextField("a", validators.required(isRequiredMessage)),
    num: 12,
    b: {
      c: {
        d: new TextField("d", validators.required(isRequiredMessage)),
        k: null,
      },
    },
  };

  expect(isFormValid(f)).toBeTruthy();
  expect(isFormTouched(f)).toBeFalsy();

  f.b.c.d.onChange("");

  expect(isFormTouched(f)).toBeTruthy();
  expect(isFormValid(f)).toBeFalsy();
});

test("formIsTouched with ListField and nested fields", () => {
  const f = {
    a: new TextField(""),
    b: new ListField([new TextField(""), new TextField("")]),
  };

  expect(isFormTouched(f)).toBeFalsy();
  f.a.onChange("1");
  expect(isFormTouched(f)).toBeTruthy();
  formUnTouchAll(f);
  expect(isFormTouched(f)).toBeFalsy();

  f.b.push(new TextField(""));
  expect(isFormTouched(f)).toBeTruthy();
  formUnTouchAll(f);
  expect(isFormTouched(f)).toBeFalsy();

  // f.b.value[0].onChange("1");
  // expect(isFormTouched(f)).toBeTruthy();
  // formUnTouchAll(f);
  // expect(isFormTouched(f)).toBeFalsy();

  const f2 = {
    b: new ListField([
      {
        id: 1,
        text: new TextField(""),
      },
    ]),
  };
  expect(isFormTouched(f2)).toBeFalsy();
  f2.b.value[0].text.onChange("1");
  expect(isFormTouched(f2)).toBeTruthy();
});

test("formTouchAll / formUnTouchAll", () => {
  const f = {
    a: new TextField("a", validators.required(isRequiredMessage)),
    b: {
      c: {
        d: new TextField("d", validators.required(isRequiredMessage)),
        k: null,
      },
    },
    e: [new TextField("")],
    d: new ListField<number>([]),
  };

  expect(isFormTouched(f)).toBeFalsy();
  expect(isFormTouched(f)).toBeFalsy();
  expect(isFormTouched(f.b.c)).toBeFalsy();

  formTouchAll(f);

  expect(isFormTouched(f)).toBeTruthy();
  expect(isFormTouched(f)).toBeTruthy();
  expect(isFormTouched(f.b.c)).toBeTruthy();

  formUnTouchAll(f);

  expect(isFormTouched(f)).toBeFalsy();
  expect(isFormTouched(f)).toBeFalsy();
  expect(isFormTouched(f.b.c)).toBeFalsy();

  f.e[0].touch();
  expect(isFormTouched(f)).toBeTruthy();

  formUnTouchAll(f);
  expect(isFormTouched(f)).toBeFalsy();

  f.d.push(1);
  expect(isFormTouched(f)).toBeTruthy();

  formUnTouchAll(f);
  expect(isFormTouched(f)).toBeFalsy();
});
