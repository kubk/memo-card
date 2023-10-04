import { makeAutoObservable } from "mobx";

export class TextField<T> {
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

  get props() {
    return {
      value: this.value,
      onChange: this.onChange,
      onBlur: this.touch,
      error: this.error,
      isTouched: this.isTouched,
    };
  }
}
