import { makeAutoObservable } from "mobx";
import { FieldWithValue } from "./field-with-value.ts";

export class BooleanToggle implements FieldWithValue<boolean> {
  constructor(public value: boolean) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggle() {
    this.value = !this.value;
  }

  setTrue() {
    this.value = true;
  }

  setFalse() {
    this.value = false;
  }

  setValue(value: boolean) {
    this.value = value;
  }
}
