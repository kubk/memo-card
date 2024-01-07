import { makeAutoObservable } from "mobx";
import { FieldWithValue } from "./field-with-value.ts";
import { TouchableField } from "./touchable-field.ts";

export class TextField<T> implements FieldWithValue<T>, TouchableField {
  isTouched = false;

  constructor(
    public value: T,
    public validate?: (value: any) => string | undefined,
  ) {
    makeAutoObservable(this, { validate: false }, { autoBind: true });
  }

  onChange(value: T) {
    this.value = value;
    this.isTouched = true;
  }

  get error() {
    return this.validate?.(this.value);
  }

  touch() {
    this.isTouched = true;
  }

  onBlur() {
    this.touch();
  }

  unTouch() {
    this.isTouched = false;
  }
}
