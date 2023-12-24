import { makeAutoObservable } from "mobx";

export class BooleanField {
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
