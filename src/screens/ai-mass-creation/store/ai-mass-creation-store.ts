import { makeAutoObservable } from "mobx";
import {
  BooleanToggle,
  formTouchAll,
  isFormValid,
  ListField,
  TextField,
  validators,
} from "mobx-form-lite";
import { t } from "../../../translations/t.ts";
import {
  addCardsMultipleRequest,
  aiMassGenerateRequest,
  aiUserCredentialsCheckRequest,
  upsertUserAiCredentialsRequest,
  userPreviousPromptsRequest,
} from "../../../api/api.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { showConfirm } from "../../../lib/telegram/show-confirm.ts";

export const chatGptModels = [
  "gpt-4-0125-preview",
  "gpt-4-turbo-preview",
  "gpt-4-1106-preview",
  "gpt-4-vision-preview",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k-0613",
];

type ChatGptModel = (typeof chatGptModels)[number];

type InnerScreen = "how" | "apiKeys" | "cardsGenerated" | "previousPrompts";

export class AiMassCreationStore {
  upsertUserAiCredentialsRequest = new RequestStore(
    upsertUserAiCredentialsRequest,
  );
  isApiKeysSetRequest = new RequestStore(aiUserCredentialsCheckRequest);
  aiMassGenerateRequest = new RequestStore(aiMassGenerateRequest);
  addCardsMultipleRequest = new RequestStore(addCardsMultipleRequest);
  userPreviousPromptsRequest = new RequestStore(userPreviousPromptsRequest);

  screen = new TextField<InnerScreen | null>(null);
  forceUpdateApiKey = new BooleanToggle(false);

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
    // A field to just show error on submit
    apiKey: new TextField("", {
      validate: () => {
        if (!this.isApiKeysSet) {
          return t("ai_cards_validation_key_required");
        }
      },
    }),
  };

  apiKeysForm = {
    apiKey: new TextField("", {
      validate: (value) => {
        if (!this.isApiKeysSet || this.forceUpdateApiKey.value) {
          return validators.required(t("validation_required"))(value);
        }
      },
    }),
    model: new TextField<ChatGptModel>("gpt-3.5-turbo"),
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

  load() {
    this.isApiKeysSetRequest.execute();
  }

  goApiKeysScreen() {
    if (!this.isApiKeysSetRequest.isSuccess) {
      return;
    }
    this.screen.onChange("apiKeys");
  }

  get isApiKeysSet() {
    return this.isApiKeysSetRequest.result.status === "success"
      ? this.isApiKeysSetRequest.result.data.is_ai_credentials_set
      : false;
  }

  get isApiKeyRegularInput() {
    if (this.forceUpdateApiKey.value) {
      return true;
    }
    return !this.isApiKeysSet;
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
      screenStore.go({
        type: "deckForm",
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

  submitApiKeysForm() {
    if (!isFormValid(this.apiKeysForm)) {
      formTouchAll(this.apiKeysForm);
      return;
    }

    this.upsertUserAiCredentialsRequest
      .execute({
        open_ai_key: this.apiKeysForm.apiKey.value,
        open_ai_model: this.apiKeysForm.model.value,
      })
      .then(() => {
        this.load();
        this.screen.onChange(null);
        this.apiKeysForm.apiKey.onChange("");
      });
  }

  async submitPromptForm() {
    if (!isFormValid(this.promptForm)) {
      formTouchAll(this.promptForm);
      return;
    }

    const result = await this.aiMassGenerateRequest.execute({
      prompt: this.promptForm.prompt.value,
      frontPrompt: this.promptForm.frontPrompt.value,
      backPrompt: this.promptForm.backPrompt.value,
      examplePrompt: this.promptForm.examplePrompt.value,
    });

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

    assert(screenStore.screen.type === "aiMassCreation", "Invalid screen type");

    const result = await this.addCardsMultipleRequest.execute({
      deckId: screenStore.screen.deckId,
      cards: this.massCreationForm.cards.value,
    });

    if (result.status === "error") {
      throw new Error("Failed to add cards");
    }

    notifySuccess(t("ai_cards_added"));
    deckListStore.replaceDeck(result.data.deck);
    screenStore.go({
      type: "deckForm",
      deckId: screenStore.screen.deckId,
    });
  }
}
