import { makeAutoObservable } from "mobx";
import { apiDeckCatalog } from "../api/api.ts";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { DeckCatalogResponse } from "../../functions/catalog-decks.ts";
import { TextField } from "../lib/mobx-form/mobx-form.ts";

export enum LanguageFilter {
  Any = "any",
  English = "en",
  Spanish = "es",
  Russian = "ru",
}

export class DeckCatalogStore {
  decks?: IPromiseBasedObservable<DeckCatalogResponse>;
  filters = {
    language: new TextField(LanguageFilter.Any),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.decks = fromPromise(apiDeckCatalog());
  }

  get filteredDecks() {
    if (this.decks?.state !== "fulfilled") {
      return [];
    }

    const language = this.filters.language.value;

    return this.decks.value.decks.filter((deck) => {
      if (language === LanguageFilter.Any) {
        return true;
      }
      if (deck.available_in !== language) {
        return false;
      }
      return true;
    });
  }
}
