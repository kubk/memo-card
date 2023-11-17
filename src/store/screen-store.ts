import { makeAutoObservable } from "mobx";

type Route =
  | { type: "main" }
  | { type: "deckMine"; deckId: number }
  | { type: "deckPublic"; deckId: number }
  // TODO: rename to deck id
  | { type: "deckForm"; deckFormId?: number }
  // TODO: rename to deck id
  | { type: "cardQuickAddForm"; cardQuickAddDeckId: number }
  | { type: "userSettings" };

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
    return (
      this.screen.type === "deckPublic" ||
      this.screen.type === "deckMine"
    );
  }
}

export const screenStore = new ScreenStore();
