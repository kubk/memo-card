import { RequestStore } from "../../../../lib/mobx-request/request-store.ts";
import { formTouchAll, isFormValid, TextField } from "mobx-form-lite";
import { CardFormType } from "../../deck-form/store/deck-form-store.ts";
import { makeAutoObservable } from "mobx";
import { notifyError } from "../../../shared/snackbar/snackbar.tsx";
import { t } from "../../../../translations/t.ts";
import { api } from "../../../../api/trpc-api.ts";
import { LimitedDeckForm } from "./card-preview-types.ts";

export class AiSpeechGeneratorStore {
  speechGenerateRequest = new RequestStore(api.aiSpeechGenerate.mutate);

  form = {
    sourceText: new TextField("", {
      validate: (value) => {
        if (!value && !this.form.sourceSide.value) {
          return t("ai_speech_validate");
        }
      },
      afterChange: (newValue) => {
        if (newValue && this.form.sourceSide.value !== null) {
          this.form.sourceSide.onChange(null);
        }
      },
    }),
    sourceSide: new TextField<"front" | "back" | null>(null),
  };

  constructor(
    public cardForm: CardFormType,
    public deckForm: LimitedDeckForm,
  ) {
    makeAutoObservable(
      this,
      {
        cardForm: false,
        deckForm: false,
      },
      { autoBind: true },
    );
  }

  async generate() {
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const language = this.deckForm.speakingCardsLocale.value;
    if (!language) {
      notifyError(false, { message: "Please set a language for the deck" });
      return;
    }

    const text = (() => {
      if (this.form.sourceText.value) {
        return this.form.sourceText.value;
      }
      if (this.form.sourceSide.value) {
        return this.cardForm[this.form.sourceSide.value].value;
      }
      throw new Error("Unexpected state");
    })();

    const result = await this.speechGenerateRequest.execute({
      text,
      language,
    });

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error generating AI voice" });
      return;
    }
    if (!result.data.data) {
      notifyError(false, { message: result.data.error });
      return;
    }

    this.cardForm.options.onChange({
      ...(this.cardForm.options.value || {}),
      voice: result.data.data.publicUrl,
    });
  }

  onDeleteAiVoice() {
    this.cardForm.options.onChange({
      ...(this.cardForm.options.value || {}),
      voice: null,
    });
  }
}
