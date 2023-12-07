import { makeAutoObservable } from "mobx";

export class BooleanToggle {
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
}
