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
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";

type InnerScreen = "how" | "cardsGenerated" | "previousPrompts";

export class AiMassCreationStore {
  aiMassGenerateRequest = new RequestStore(api.aiMassGenerate.mutate);
  addCardsMultipleRequest = new RequestStore(api.card.addMultiple.mutate);
  userPreviousPromptsRequest = new RequestStore(api.prompt.myPrevious.query);

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
    selectedCardIndex: TextField<null | number>;
    cards: ListField<{
      front: string;
      back: string;
      example: string | null | undefined;
    }>;
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private async onQuit(redirect: () => void) {
    const isConfirmed = await showConfirm(t("quit_without_saving"));
    if (isConfirmed) {
      redirect();
    }
  }

  onQuitToDeck() {
    this.onQuit(() => {
      const { screen } = screenStore;
      assert(screen.type === "aiMassCreation", "Invalid screen type");
      screenStore.goToDeckForm({
        deckId: screen.deckId,
      });
    });
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
      this.userPreviousPromptsRequest.result.status === "success",
      "Invalid status",
    );
    assert(index.value !== null, "Empty index");
    const log = this.userPreviousPromptsRequest.result.data[index.value];
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

    const result = await this.aiMassGenerateRequest.execute(formPlain);

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Failed to generated cards" });
      return;
    }

    const innerResult = result.data;
    if (innerResult.data) {
      this.massCreationForm = {
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

    const { screen } = screenStore;

    assert(screen.type === "aiMassCreation", "Invalid screen type");

    const result = await this.addCardsMultipleRequest.execute({
      deckId: screen.deckId,
      cards: this.massCreationForm.cards.value,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Failed to add multiple cards" });
      return;
    }

    notifySuccess(t("ai_cards_added"));
    deckListStore.replaceDeck(result.data.deck);
    deckListStore.updateCardsToReview(result.data.cardsToReview);
    screenStore.goToDeckForm({
      deckId: screen.deckId,
    });
  }
}
