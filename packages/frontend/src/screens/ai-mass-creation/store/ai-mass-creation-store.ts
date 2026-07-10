import { makeAutoObservable } from "mobx";
import {
  formToPlain,
  formTouchAll,
  isFormValid,
  ListField,
  TextField,
  validators,
} from "mobx-form-lite";
import { t } from "../../../translations/t.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";
import { voiceGenerationStore } from "../../../store/voice-generation-store.ts";
import { aiMassCreationDraftStore } from "./ai-mass-creation-draft-store.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";

type InnerScreen = "how" | "cardsGenerated" | "previousPrompts";

export class AiMassCreationStore {
  aiMassGenerateMutation = makeMutation(api.aiMassGenerate.mutate);
  createDeckWithCardsMutation = makeMutation(api.deck.createWithCards.mutate);
  userPreviousPromptsQuery = makeQuery({
    key: "prompt.myPrevious",
    query: api.prompt.myPrevious.query,
  });
  deckDraft = aiMassCreationDraftStore.deckDraft;

  screen = new TextField<InnerScreen | null>(null);

  promptForm = {
    prompt: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    frontPrompt: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    backPrompt: new TextField("", {
      validate: validators.required(t("validation_required")),
    }),
    examplePrompt: new TextField(""),
  };

  massCreationForm?: {
    deckTitle: string;
    selectedCardIndex: TextField<null | number>;
    cards: ListField<{
      front: string;
      back: string;
      example: string | null | undefined;
    }>;
  };

  constructor() {
    if (this.deckDraft?.description) {
      this.promptForm.prompt.onChange(this.deckDraft.description);
    }

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isSavingCards() {
    return this.createDeckWithCardsMutation.isPending;
  }

  private async onQuit(redirect: () => void) {
    const isConfirmed = await showConfirm(t("quit_without_saving"));
    if (isConfirmed) {
      redirect();
    }
  }

  onQuitBack() {
    this.onQuit(() => {
      this.screen.onChange(null);
    });
  }

  get massCreationFormPreviewCard() {
    if (!this.massCreationForm) {
      return null;
    }
    if (this.massCreationForm.selectedCardIndex.value === null) {
      return null;
    }

    const card =
      this.massCreationForm.cards.value[
        this.massCreationForm.selectedCardIndex.value
      ];
    if (!card) {
      return null;
    }

    return {
      ...card,
      example: card.example || undefined,
    };
  }

  async deleteGeneratedCard(index: number) {
    if (!this.canDeleteGeneratedCard) {
      return;
    }
    const isConfirmed = await showConfirm(t("ai_cards_confirm_delete"));
    if (!isConfirmed) {
      return;
    }
    this.massCreationForm?.cards.removeByIndex(index);
  }

  get canDeleteGeneratedCard() {
    if (!this.massCreationForm) {
      return false;
    }
    return this.massCreationForm.cards.value.length > 1;
  }

  get isBottomSheetScreen() {
    return this.screen.value === "how";
  }

  usePreviousPrompt(index: TextField<number | null>) {
    assert(
      this.userPreviousPromptsQuery.data,
      "Previous prompts should be loaded",
    );
    assert(index.value !== null, "Empty index");
    const log = this.userPreviousPromptsQuery.data[index.value];
    assert(log, "Invalid log index");
    this.promptForm.prompt.onChange(log.payload.prompt);
    this.promptForm.frontPrompt.onChange(log.payload.frontPrompt);
    this.promptForm.backPrompt.onChange(log.payload.backPrompt);
    const examplePrompt = log.payload.examplePrompt || "";
    this.promptForm.examplePrompt.onChange(examplePrompt);
    this.screen.onChange(null);
  }

  async submitPromptForm() {
    if (!isFormValid(this.promptForm)) {
      formTouchAll(this.promptForm);
      return;
    }

    const formPlain = formToPlain(this.promptForm);

    const result = await this.aiMassGenerateMutation.mutateResult(formPlain);

    if (!result.ok) {
      notifyError({ e: result.error, info: "Failed to generated cards" });
      return;
    }

    const innerResult = result.data;
    if (innerResult.data) {
      this.massCreationForm = {
        deckTitle: innerResult.data.title,
        selectedCardIndex: new TextField<number | null>(null),
        cards: new ListField(
          innerResult.data.cards.map((card) => ({
            front: card.front,
            back: card.back,
            example: card.example,
          })),
        ),
      };
      this.screen.onChange("cardsGenerated");
    } else {
      notifyError(false, { message: innerResult.error });
    }
  }

  async submitMassCreationForm() {
    if (!this.massCreationForm) {
      return;
    }
    if (!isFormValid(this.massCreationForm)) {
      formTouchAll(this.massCreationForm);
      return;
    }

    await this.submitCreateDeckMassCreationForm();
  }

  private getGeneratedDeckTitle() {
    assert(this.massCreationForm, "Mass creation form should be defined");

    const generatedTitle = this.massCreationForm.deckTitle.trim();
    assert(generatedTitle, "Generated deck title should be defined");
    return generatedTitle;
  }

  private async submitCreateDeckMassCreationForm() {
    assert(this.massCreationForm, "Mass creation form should be defined");

    const result = await this.createDeckWithCardsMutation.mutateResult({
      title: this.getGeneratedDeckTitle(),
      description: this.deckDraft?.description || null,
      folderId: this.deckDraft?.folderId,
      cards: this.massCreationForm.cards.value,
    });

    if (!result.ok) {
      notifyError({
        e: result.error,
        info: "Failed to create deck with cards",
      });
      return;
    }

    notifySuccess(t("ai_cards_added"));
    deckListStore.replaceDeck(result.data.deck, true);
    deckListStore.updateFolders(result.data.folders);
    deckListStore.updateCardsToReview(result.data.cardsToReview);
    aiMassCreationDraftStore.clearDeckDraft();
    screenStore.replace({ type: "main" });
    screenStore.push({ type: "deckForm", deckId: result.data.deck.id });

    voiceGenerationStore.generateForDeckCards(
      result.data.deck.id,
      result.data.createdCards,
    );
  }
}
