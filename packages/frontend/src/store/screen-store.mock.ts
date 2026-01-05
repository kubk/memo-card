import { makeAutoObservable } from "mobx";
import { Route, DeckFormRoute } from "./routing/route-types.ts";

let routeIndex = 0;

class InMemoryScreenStore {
  history: Route[] = [{ type: "main" }];

  constructor(initialRoute?: Route) {
    makeAutoObservable(this, {}, { autoBind: true });
    if (initialRoute) {
      this.history = [initialRoute];
    }
  }

  go(route: Route) {
    this.history.push(route);
  }

  replace(route: Route) {
    if (this.history.length > 0) {
      this.history[this.history.length - 1] = route;
    } else {
      this.history.push(route);
    }
  }

  back() {
    if (this.history.length > 1) {
      this.history.pop();
    }
  }

  backToDeck(_deckId: number) {
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

  reset(initialRoute: Route) {
    this.history = [initialRoute];
  }
}

const defaultRoute = {
  type: "deckForm" as const,
  deckId: 1,
  sortBy: "createdAt" as const,
  sortDirection: "desc" as const,
};

export const mockScreenStore = new InMemoryScreenStore(defaultRoute);
