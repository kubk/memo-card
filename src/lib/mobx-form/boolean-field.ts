import { makeAutoObservable } from "mobx";
import { TouchableField } from "./touchable-field.ts";

export class BooleanField implements TouchableField {
  isTouched = false;

  constructor(
    public value: boolean,
    public validate?: (value: any) => string | undefined,
  ) {
    makeAutoObservable(this, { validate: false }, { autoBind: true });
  }

  setValue(value: boolean) {
    this.value = value;
    this.isTouched = true;
  }

  toggle() {
    this.setValue(!this.value);
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
