import { autorun, makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { getStorageAdapter } from "../platform/storage-adapter.ts";

export type FontSize = "normal" | "medium" | "large";

export const fontSizes: FontSize[] = ["normal", "medium", "large"];

class FontSizeStore {
  fontSize: FontSize = "normal";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    makePersistable(this, {
      name: "fontSize",
      properties: ["fontSize"],
      storage: getStorageAdapter(),
    });

    autorun(() => {
      if (this.fontSize === "normal") {
        delete document.documentElement.dataset.fontSize;
      } else {
        document.documentElement.dataset.fontSize = this.fontSize;
      }
    });
  }

  setFontSize(fontSize: FontSize) {
    this.fontSize = fontSize;
  }
}

export const fontSizeStore = new FontSizeStore();
