import { makeAutoObservable, reaction } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { isRunningWithinTelegram } from "../lib/platform/is-running-within-telegram.ts";

class ErudaStore {
  isEnabled = persistableField(new BooleanToggle(false), "isErudaEnabled");

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    if (!isRunningWithinTelegram()) {
      return;
    }

    reaction(
      () => this.isEnabled.value,
      (enabled) => {
        if (enabled) {
          this.addToDom();
        } else {
          this.removeFromDom();
        }
      },
      { fireImmediately: true },
    );
  }

  private addToDom() {
    if (document.getElementById("eruda-script")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.id = "eruda-script";
    script.onload = () => {
      // @ts-ignore
      window.eruda.init();
    };
    document.body.appendChild(script);
  }

  private removeFromDom() {
    // @ts-ignore
    if (window.eruda) {
      // @ts-ignore
      window.eruda.destroy();
    }
    document.getElementById("eruda-script")?.remove();
  }
}

export const erudaStore = new ErudaStore();
