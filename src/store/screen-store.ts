import { makeAutoObservable } from "mobx";
import { CardFormType } from "../screens/deck-form/store/deck-form-store.ts";

type Route =
  | { type: "main" }
  | { type: "deckMine"; deckId: number; backScreen?: RouteType }
  | { type: "deckPublic"; deckId: number; backScreen?: RouteType }
  | { type: "deckForm"; deckId?: number; folder?: { id: number; name: string } }
  | { type: "cardPreview"; form: CardFormType }
  | { type: "folderForm"; folderId?: number }
  | { type: "folderPreview"; folderId: number }
  | { type: "deckOrFolderChoose" }
  | { type: "reviewAll" }
  | { type: "cardQuickAddForm"; deckId: number }
  | { type: "deckCatalog" }
  | { type: "shareDeck"; deckId: number; shareId: string }
  | { type: "userSettings" };

export type RouteType = Route["type"];

export class ScreenStore {
  history: Route[] = [{ type: "main" }];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  go(historyData: Route) {
    this.history.push(historyData);
  }

  back() {
    if (this.history.length > 1) {
      this.history.pop();
    }
  }

  get screen(): Route {
    return this.history[this.history.length - 1];
  }

  get isDeckPreviewScreen() {
    return this.screen.type === "deckPublic" || this.screen.type === "deckMine";
  }
}

export const screenStore = new ScreenStore();
