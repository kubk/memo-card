import { makeAutoObservable } from "mobx";

type WysiwygBottomSheet = "table" | "colorPicker" | "help";

class WysiwygStore {
  bottomSheet: null | WysiwygBottomSheet = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  openBottomSheet(bottomSheet: WysiwygBottomSheet) {
    this.bottomSheet = bottomSheet;
  }

  closeBottomSheet() {
    this.bottomSheet = null;
  }
}

export const wysiwygStore = new WysiwygStore();
