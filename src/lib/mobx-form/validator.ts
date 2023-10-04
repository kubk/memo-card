// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// https://codesandbox.io/s/github/final-form/react-final-form/tree/master/examples/field-level-validation?file=/index.js

export const validators = {
  required:
    (errorMessage = "Required") =>
    (value) =>
      value ? undefined : errorMessage,
  number: (value) => (isNaN(value) ? "Must be a number" : undefined),
  all:
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      ),
};
