import { makeAutoObservable } from "mobx";
import { platform } from "../lib/platform/platform.ts";
import { screenStore } from "./screen-store.ts";

export type BottomNavigationTab =
  | "main"
  | "leaderboard"
  | "settings"
  | "review";

class BottomNavigationStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get activeTab(): BottomNavigationTab | null {
    const screenType = screenStore.screen.type;

    if (screenType === "main") {
      return "main";
    }
    if (screenType === "leaderboard") {
      return "leaderboard";
    }
    if (screenType === "userSettings") {
      return "settings";
    }
    if (screenType === "reviewCustom") {
      return "review";
    }

    return null;
  }

  get isVisible() {
    return (
      (this.activeTab === "main" ||
        this.activeTab === "leaderboard" ||
        this.activeTab === "settings") &&
      !platform.isMainButtonVisible
    );
  }

  navigate(tab: BottomNavigationTab) {
    if (tab === this.activeTab) {
      return;
    }

    platform.haptic("selection");

    if (tab === "main") {
      screenStore.push({ type: "main" });
      return;
    }
    if (tab === "leaderboard") {
      screenStore.push({ type: "leaderboard" });
      return;
    }
    if (tab === "settings") {
      screenStore.goToUserSettings();
      return;
    }

    screenStore.push({ type: "reviewCustom" });
  }
}

export const bottomNavigationStore = new BottomNavigationStore();
