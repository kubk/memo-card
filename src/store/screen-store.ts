import { makeAutoObservable } from "mobx";

export enum Screen {
  Main = "main",
  DeckMine = "deckMine",
  DeckPublic = "deckPublic",
  DeckForm = "deckForm",
  CardQuickAddForm = "cardQuickAddForm",
}

export class ScreenStore {
  screen = Screen.Main;
  deckId?: number;
  deckFormId?: number;
  cardQuickAddDeckId?: number;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  navigateToMain() {
    this.screen = Screen.Main;
  }

  navigateToMineDeck(deckId: number) {
    this.deckId = deckId;
    this.screen = Screen.DeckMine;
  }

  navigateToPublicDeck(deckId: number) {
    this.deckId = deckId;
    this.screen = Screen.DeckPublic;
  }

  navigateToDeckForm(deckFormId?: number) {
    this.screen = Screen.DeckForm;
    this.deckFormId = deckFormId;
  }

  navigateToQuickCardAdd(deckId: number) {
    this.screen = Screen.CardQuickAddForm;
    this.cardQuickAddDeckId = deckId;
  }

  get isDeckPreviewScreen() {
    return this.screen === Screen.DeckPublic || this.screen === Screen.DeckMine;
  }
}

export const screenStore = new ScreenStore();
