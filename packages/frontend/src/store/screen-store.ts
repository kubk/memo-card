import { makeAutoObservable } from "mobx";
import { routeToUrl, urlToRoute } from "./routing/url-sync.ts";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { Route, DeckFormRoute } from "./routing/route-types.ts";

let routeIndex = 0;

export class ScreenStore {
  private history: Route[] = [{ type: "main" }];
  private isNavigatingFromPopstate = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
    this.history.push(route);

    if (platform instanceof BrowserPlatform && !this.isNavigatingFromPopstate) {
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

    if (platform instanceof BrowserPlatform && !this.isNavigatingFromPopstate) {
      const url = routeToUrl(route);
      const currentUrl = window.location.pathname + window.location.search;

      if (url !== currentUrl) {
        window.history.replaceState(null, "", url);
      }
    }
  }

  back() {
    if (platform instanceof BrowserPlatform) {
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
    this.go({ type: "userSettings", index: ++routeIndex });
  }

  goToDeckForm(route: Omit<DeckFormRoute, "index" | "type">) {
    this.go({
      ...route,
      type: "deckForm",
    });
  }

  replaceToDeckForm(route: Omit<DeckFormRoute, "index" | "type">) {
    this.replace({
      ...route,
      type: "deckForm",
    });
  }

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }
}

export const screenStore = new ScreenStore();
