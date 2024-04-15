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
} from "../../../api/api.ts";
import { RequestStore } from "../../../lib/mobx-request/requestStore.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { notifySuccess } from "../../shared/snackbar.tsx";
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

export class AiMassCreationStore {
  upsertUserAiCredentialsRequest = new RequestStore(
    upsertUserAiCredentialsRequest,
  );
  isApiKeysSetRequest = new RequestStore(aiUserCredentialsCheckRequest);
  aiMassGenerateRequest = new RequestStore(aiMassGenerateRequest);
  addCardsMultipleRequest = new RequestStore(addCardsMultipleRequest);

  screen = new TextField<"how" | "apiKeys" | "cardsGenerated" | null>(null);
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
    // A field to just show error on submit
    apiKey: new TextField("", {
      validate: () => {
        if (!this.isApiKeysSet) {
          return "API key is required";
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
    cards: ListField<{ front: string; back: string }>;
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

  private async onQuit(redirect: () => void) {
    const isConfirmed = await showConfirm(
      "Are you sure you want to quit without saving?",
    );
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

  submitPromptForm() {
    if (!isFormValid(this.promptForm)) {
      formTouchAll(this.promptForm);
      return;
    }

    this.aiMassGenerateRequest
      .execute({
        prompt: this.promptForm.prompt.value,
        frontPrompt: this.promptForm.frontPrompt.value,
        backPrompt: this.promptForm.backPrompt.value,
      })
      .then((result) => {
        if (result.status === "success") {
          const innerResult = result.data;
          if (innerResult.data) {
            this.massCreationForm = {
              cards: new ListField<{ front: string; back: string }>(
                innerResult.data.cards.map((card) => ({
                  front: card.front,
                  back: card.back,
                })),
              ),
            };
            this.screen.onChange("cardsGenerated");
          } else {
            console.log(innerResult.error);
            console.log("Error");
          }
        } else {
          throw new Error("Failed to generate cards");
        }
      });
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

    if (result.status !== "success") {
      throw new Error("Failed to add cards");
    }

    notifySuccess("Cards added to the deck");
    deckListStore.replaceDeck(result.data.deck);
    screenStore.go({
      type: "deckForm",
      deckId: screenStore.screen.deckId,
    });
  }
}
