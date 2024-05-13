import { makeAutoObservable } from "mobx";
import { CardFormType } from "../screens/deck-form/deck-form/store/deck-form-store.ts";
import { makeLoggable } from "mobx-log";

type Route =
  | { type: "main" }
  | { type: "deckMine"; deckId: number }
  | { type: "deckPublic"; deckId: number }
  | {
      type: "deckForm";
      deckId?: number;
      folder?: { id: number; name: string };
      cardId?: number;
    }
  | { type: "cardPreview"; form: CardFormType }
  | { type: "folderForm"; folderId?: number }
  | { type: "folderPreview"; folderId: number }
  | { type: "deckOrFolderChoose" }
  | { type: "reviewAll" }
  | { type: "cardQuickAddForm"; deckId: number }
  | { type: "deckCatalog" }
  | { type: "shareDeck"; deckId: number; shareId: string }
  | { type: "shareFolder"; folderId: number; shareId: string }
  | { type: "aiMassCreation"; deckId: number; deckTitle: string | null }
  | { type: "plans" }
  | { type: "debug" }
  | { type: "componentCatalog" }
  | { type: "freezeCards" }
  | { type: "userStatistics" }
  | { type: "userSettings" };

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

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }
}

export const screenStore = new ScreenStore();
