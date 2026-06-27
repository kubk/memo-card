import { makeAutoObservable } from "mobx";
import { routeToUrl, urlToRoute } from "./routing/url-sync.ts";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { Route } from "./routing/route-types.ts";

let routeIndex = 0;
let historyEntryIndex = 0;
const maxBackSteps = 3;

type ScreenStoreOptions = {
  enableUrlSync?: boolean;
};

type NavigationDirection = "forward" | "back" | "replace";

type HistoryEntry = {
  id: number;
  route: Route;
  scrollTop: number;
};

function createHistoryEntry(route: Route, scrollTop = 0): HistoryEntry {
  return {
    id: ++historyEntryIndex,
    route,
    scrollTop,
  };
}

function trimBackStack(stack: HistoryEntry[]): HistoryEntry[] {
  if (stack.length <= maxBackSteps + 1) {
    return stack;
  }

  const root = stack[0];
  if (!root) {
    return stack.slice(-maxBackSteps);
  }

  return [root, ...stack.slice(-maxBackSteps)];
}

function areRoutesEqual(first: Route, second: Route) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function findRouteIndex(history: HistoryEntry[], route: Route) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (areRoutesEqual(history[i].route, route)) {
      return i;
    }
  }

  return -1;
}

export class ScreenStore {
  private history: HistoryEntry[] = [createHistoryEntry({ type: "main" })];
  private isUrlSyncEnabled: boolean;
  private isNavigatingFromPopstate = false;
  private navigationDirection: NavigationDirection = "replace";

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
      this.history = [createHistoryEntry(initialRoute)];
    }

    window.addEventListener("popstate", this.handlePopstate);
  }

  private handlePopstate = () => {
    const route = urlToRoute(window.location.href);
    if (!route) {
      return;
    }

    this.isNavigatingFromPopstate = true;

    const currentIndex = this.history.length - 1;
    const routeIndex = findRouteIndex(this.history, route);

    if (routeIndex >= 0) {
      this.navigationDirection = routeIndex < currentIndex ? "back" : "replace";
      this.history = this.history.slice(0, routeIndex + 1);
    } else {
      this.navigationDirection = "forward";
      this.history = trimBackStack([
        ...this.history,
        createHistoryEntry(route),
      ]);
    }

    this.isNavigatingFromPopstate = false;
  };

  push(route: Route) {
    this.navigationDirection = "forward";
    this.history.push(createHistoryEntry(route));
    this.history = trimBackStack(this.history);

    if (this.isUrlSyncEnabled && !this.isNavigatingFromPopstate) {
      this.pushBrowserUrl(route);
    }
  }

  replace(route: Route) {
    this.navigationDirection = "replace";

    const currentEntry = this.history[this.history.length - 1];
    if (currentEntry) {
      if (currentEntry.route.type === route.type) {
        currentEntry.route = route;
      } else {
        this.history[this.history.length - 1] = createHistoryEntry(route);
      }
    } else {
      this.history.push(createHistoryEntry(route));
    }

    this.history = trimBackStack(this.history);

    if (this.isUrlSyncEnabled && !this.isNavigatingFromPopstate) {
      this.replaceBrowserUrl(route);
    }
  }

  back() {
    this.navigationDirection = "back";

    if (this.isUrlSyncEnabled) {
      window.history.back();
      return;
    }

    if (this.history.length > 1) {
      this.history.pop();
    }
  }

  backToDeck(deckId: number) {
    this.navigationDirection = "back";

    for (let i = this.history.length - 2; i >= 0; i--) {
      const { route } = this.history[i];
      if (route.type === "deckForm" && route.deckId === deckId) {
        this.history = this.history.slice(0, i + 1);
        if (this.isUrlSyncEnabled) {
          this.replaceBrowserUrl(this.screen);
        }
        return;
      }
    }
    this.back();
  }

  setCurrentScrollTop(scrollTop: number) {
    const currentEntry = this.history[this.history.length - 1];
    if (!currentEntry) {
      return;
    }

    currentEntry.scrollTop = scrollTop;
  }

  get screen(): Route {
    return this.history[this.history.length - 1].route;
  }

  get screenEntryId() {
    return this.history[this.history.length - 1].id;
  }

  get currentScrollTop() {
    return this.history[this.history.length - 1].scrollTop;
  }

  get screenNavigationDirection() {
    return this.navigationDirection;
  }

  goToUserSettings() {
    this.push({ type: "userSettings", index: ++routeIndex });
  }

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }

  private pushBrowserUrl(route: Route) {
    const url = routeToUrl(route);
    const currentUrl = window.location.pathname + window.location.search;

    if (url !== currentUrl) {
      window.history.pushState(null, "", url);
    }
  }

  private replaceBrowserUrl(route: Route) {
    const url = routeToUrl(route);
    const currentUrl = window.location.pathname + window.location.search;

    if (url !== currentUrl) {
      window.history.replaceState(null, "", url);
    }
  }
}

export const screenStore = new ScreenStore();
