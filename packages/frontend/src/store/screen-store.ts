import { makeAutoObservable } from "mobx";
import { routeToUrl, urlToRoute } from "./routing/url-sync.ts";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { Route } from "./routing/route-types.ts";

let routeIndex = 0;
const maxBackSteps = 3;

type ScreenStoreOptions = {
  enableUrlSync?: boolean;
};

function trimBackStack(stack: Route[]): Route[] {
  if (stack.length <= maxBackSteps + 1) {
    return stack;
  }

  const root = stack[0];
  if (!root) {
    return stack.slice(-maxBackSteps);
  }

  return [root, ...stack.slice(-maxBackSteps)];
}

export class ScreenStore {
  private history: Route[] = [{ type: "main" }];
  private isUrlSyncEnabled: boolean;
  private isNavigatingFromPopstate = false;

  constructor(options: ScreenStoreOptions = {}) {
    this.isUrlSyncEnabled =
      options.enableUrlSync ?? platform instanceof BrowserPlatform;

    makeAutoObservable(this, {}, { autoBind: true });
    if (this.isUrlSyncEnabled) {
      this.initializeUrlSync();
    }
  }

  private initializeUrlSync() {
    const initialRoute = urlToRoute(window.location.href);
    if (initialRoute) {
      this.history = [initialRoute];
    }

    // Listen for browser back/forward
    window.addEventListener("popstate", this.handlePopstate);
  }

  private handlePopstate = () => {
    const route = urlToRoute(window.location.href);
    if (route) {
      this.isNavigatingFromPopstate = true;
      this.history = [route];
      this.isNavigatingFromPopstate = false;
    }
  };

  push(route: Route) {
    this.history.push(route);
    this.history = trimBackStack(this.history);

    if (this.isUrlSyncEnabled && !this.isNavigatingFromPopstate) {
      const url = routeToUrl(route);
      const currentUrl = window.location.pathname + window.location.search;

      if (url !== currentUrl) {
        window.history.pushState(null, "", url);
      }
    }
  }

  replace(route: Route) {
    if (this.history.length > 0) {
      this.history[this.history.length - 1] = route;
    } else {
      this.history.push(route);
    }
    this.history = trimBackStack(this.history);

    if (this.isUrlSyncEnabled && !this.isNavigatingFromPopstate) {
      const url = routeToUrl(route);
      const currentUrl = window.location.pathname + window.location.search;

      if (url !== currentUrl) {
        window.history.replaceState(null, "", url);
      }
    }
  }

  back() {
    if (this.isUrlSyncEnabled) {
      window.history.back();
      return;
    }

    if (this.history.length > 1) {
      this.history.pop();
    }
  }

  backToDeck(deckId: number) {
    for (let i = this.history.length - 2; i >= 0; i--) {
      const route = this.history[i];
      if (route.type === "deckForm" && route.deckId === deckId) {
        this.history = this.history.slice(0, i + 1);
        return;
      }
    }
    this.back();
  }

  get screen(): Route {
    return this.history[this.history.length - 1];
  }

  goToUserSettings() {
    this.push({ type: "userSettings", index: ++routeIndex });
  }

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }
}

export const screenStore = new ScreenStore();
