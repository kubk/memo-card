import { makeAutoObservable } from "mobx";
import { CardFormType } from "../screens/deck-form/deck-form/store/deck-form-store.ts";
import { makeLoggable } from "mobx-log";

type DeckFormRoute = {
  type: "deckForm";
  deckId?: number;
  folder?: { id: number; name: string };
  cardId?: number;
  index: number;
};

type Route =
  | { type: "main" }
  | { type: "deckMine"; deckId: number }
  | { type: "deckPublic"; deckId: number }
  | DeckFormRoute
  | { type: "cardPreview"; form: CardFormType }
  | { type: "folderForm"; folderId?: number }
  | { type: "folderPreview"; folderId: number }
  | { type: "reviewAll" }
  | { type: "reviewCustom" }
  | { type: "cardQuickAddForm"; deckId: number }
  | { type: "deckCatalog" }
  | { type: "shareDeck"; deckId: number; shareId: string }
  | { type: "shareFolder"; folderId: number; shareId: string }
  | { type: "aiMassCreation"; deckId: number; deckTitle: string | null }
  | { type: "catalogSettings"; id: number; itemType: "folder" | "deck" }
  | { type: "plans" }
  | { type: "debug" }
  | { type: "componentCatalog" }
  | { type: "freezeCards" }
  | { type: "userStatistics" }
  | { type: "browserLogin" }
  | { type: "userSettings"; index: number };

let routeIndex = 0;

export class ScreenStore {
  private history: Route[] = [{ type: "main" }];
  private onceRoute?: Route;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makeLoggable(this);
  }

  go(route: Route) {
    if (this.onceRoute) {
      this.onceRoute = undefined;
    }
    this.history.push(route);
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
