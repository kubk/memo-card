import { autorun } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { env } from "../env.ts";

export const erudaStore = {
  isErudaEnabled: persistableField(new BooleanToggle(false), "isErudaEnabled"),
};

if (env.VITE_STAGE === "local" || env.VITE_STAGE === "staging") {
  const isLoaded = !!window.eruda;

  autorun(() => {
    // @ts-ignore
    if (erudaStore.isErudaEnabled.value && !isLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.id = "eruda-script";
      script.onload = () => {
        // @ts-ignore
        window.eruda.init();
      };
      document.body.appendChild(script);
    } else if (!erudaStore.isErudaEnabled.value && isLoaded) {
      // @ts-ignore
      window.eruda.destroy();
      document.getElementById("eruda-script")?.remove();
    }
  });
}
