import { makeAutoObservable } from "mobx";

class OverlayStore {
  openCount = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return this.openCount > 0;
  }

  isHidingMainButton(isAboveBottomSheet?: boolean) {
    return this.isOpen && !isAboveBottomSheet;
  }

  add() {
    this.openCount += 1;
  }

  remove() {
    this.openCount = Math.max(0, this.openCount - 1);
  }
}

export const overlayStore = new OverlayStore();
