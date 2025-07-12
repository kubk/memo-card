import { makeAutoObservable } from "mobx";
import { makeLoggable } from "mobx-log";
import { routeToUrl, urlToRoute } from "./routing/url-sync.ts";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { Route, DeckFormRoute } from "./routing/route-types.ts";

let routeIndex = 0;

export class ScreenStore {
  private history: Route[] = [{ type: "main" }];
  private onceRoute?: Route;
  private isNavigatingFromPopstate = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makeLoggable(this);

    if (platform instanceof BrowserPlatform) {
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

  go(route: Route) {
    if (this.onceRoute) {
      this.onceRoute = undefined;
    }
    this.history.push(route);

    if (platform instanceof BrowserPlatform && !this.isNavigatingFromPopstate) {
      const url = routeToUrl(route);
      const currentUrl = window.location.pathname + window.location.search;

      if (url !== currentUrl) {
        window.history.pushState(null, "", url);
      }
    }
  }

  goOnce(route: Route) {
    this.onceRoute = route;
  }

  // TODO: Remove this when we have a proper navigation
  restoreHistory() {
    this.history = [{ type: "main" }];
  }

  back() {
    if (this.onceRoute) {
      this.onceRoute = undefined;
      return;
    }

    if (platform instanceof BrowserPlatform) {
      window.history.back();
      return;
    }

    if (this.history.length > 1) {
      this.history.pop();
    }
  }

  get screen(): Route {
    if (this.onceRoute) {
      return this.onceRoute;
    }
    return this.history[this.history.length - 1];
  }

  goToUserSettings() {
    this.go({ type: "userSettings", index: ++routeIndex });
  }

  goToDeckForm(route: Omit<DeckFormRoute, "index" | "type">) {
    this.go({
      ...route,
      type: "deckForm",
      index: ++routeIndex,
    });
  }

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }
}

export const screenStore = new ScreenStore();
