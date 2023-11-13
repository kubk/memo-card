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
    public example: string | null = null,
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
    assert(this.isOpened, "The card should be opened before changing state");
    this.state = state;
  }
}
