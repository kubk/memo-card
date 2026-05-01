type AiMassCreationDeckDraft = {
  description: string;
  folderId?: number;
};

class AiMassCreationDraftStore {
  deckDraft: AiMassCreationDeckDraft | null = null;

  setDeckDraft(draft: AiMassCreationDeckDraft) {
    this.deckDraft = draft;
  }

  clearDeckDraft() {
    this.deckDraft = null;
  }
}

export const aiMassCreationDraftStore = new AiMassCreationDraftStore();
