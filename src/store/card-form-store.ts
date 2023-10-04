import { makeAutoObservable } from "mobx";
import { assert } from "../lib/typescript/assert.ts";

export enum CardState {
  Remember = "remember",
  Forget = "forget",
}

export class CardFormStore {
  isOpened = false;
  state?: CardState;

  constructor(
    public id: number,
    public front: string,
    public back: string,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open() {
    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }

  changeState(state: CardState) {
    assert(this.isOpened);
    this.state = state;
  }
}
