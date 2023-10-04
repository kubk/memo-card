import { makeAutoObservable } from "mobx";
import WebApp from "@twa-dev/sdk";

export enum Screen {
  Main = "main",
  DeckMine = "deckMine",
  DeckPublic = "deckPublic",
  DeckForm = "deckForm",
}

export class ScreenStore {
  screen = Screen.Main;
  deckId?: number;
  deckFormId?: number;

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
    WebApp.expand();
  }

  get isDeckScreen() {
    return this.screen === Screen.DeckPublic || this.screen === Screen.DeckMine;
  }
}

export const screenStore = new ScreenStore();
