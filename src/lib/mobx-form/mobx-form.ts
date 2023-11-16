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

  unTouch() {
    this.isTouched = false;
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

  get props() {
    return {
      value: this.value,
      toggle: this.toggle,
      onBlur: this.touch,
      error: this.error,
      isTouched: this.isTouched,
    };
  }
}
