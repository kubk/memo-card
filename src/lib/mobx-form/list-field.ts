import { makeAutoObservable } from "mobx";
import { TouchableField } from "./touchable-field.ts";
import { FieldWithValue } from "./field-with-value.ts";

export class ListField<T> implements TouchableField, FieldWithValue<T[]> {
  isTouched = false;

  constructor(
    public value: T[],
    public validate?: (value: T[]) => string | undefined,
  ) {
    makeAutoObservable(this, { validate: false }, { autoBind: true });
  }

  add(value: T) {
    this.touch();
    this.value.push(value);
  }

  removeByIndex(index: number) {
    this.touch();
    this.value.splice(index, 1);
  }

  get error() {
    return this.validate?.(this.value);
  }

  touch() {
    this.isTouched = true;
  }

  unTouch() {
    this.isTouched = false;
  }
}
