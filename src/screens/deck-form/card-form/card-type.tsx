import { Screen } from "../../shared/screen.tsx";
import { t } from "../../../translations/t.ts";
import { Flex } from "../../../ui/flex.tsx";
import { SelectWithChevron } from "../../../ui/select-with-chevron.tsx";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { List } from "../../../ui/list.tsx";
import { action } from "mobx";
import { CardRow } from "../../../ui/card-row.tsx";
import {
  CardFormType,
  createAnswerForm,
} from "../deck-form/store/deck-form-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import {
  formatCardType,
  formatCardTypeDescription,
} from "./format-card-type.ts";
import { CardAnswerErrors } from "./card-answer-errors.tsx";

type Props = {
  cardForm: CardFormType;
  onBack: () => void;
};

export function CardType(props: Props) {
  const { cardForm, onBack } = props;

  useBackButton(() => {
    onBack();
  });

  useMainButton(t("go_back"), () => {
    onBack();
  });

  return (
    <Screen title={t("card_answer_type")}>
      <Flex direction={"column"} gap={4}>
        <Flex ml={12} mt={8} alignItems={"center"} gap={16}>
          <div className="text-hint uppercase text-sm">
            {t("card_answer_type")}
          </div>
          <SelectWithChevron
            value={cardForm.answerType.value}
            onChange={(value) => {
              cardForm?.answerType.onChange(value);
            }}
            options={[
              { label: formatCardType("remember"), value: "remember" },
              {
                label: formatCardType("choice_single"),
                value: "choice_single",
              },
            ]}
          />
        </Flex>
        <HintTransparent>
          {formatCardTypeDescription(cardForm.answerType.value)}
        </HintTransparent>
      </Flex>

      <>
        {cardForm.answerType.value === "choice_single" && (
          <>
            <List
              items={cardForm.answers.value.map((answerForm) => {
                return {
                  onClick: action(() => {
                    cardForm.answerId = answerForm.id;
                    cardForm.answerFormType = "edit";
                  }),
                  text: answerForm.text.value,
                  right: answerForm.isCorrect.value ? (
                    <i className="mdi mdi-check-circle text-success" />
                  ) : null,
                };
              })}
            />

            <CardAnswerErrors cardForm={cardForm} />
            <CardRow
              onClick={action(() => {
                const answerForm = createAnswerForm();
                cardForm.answers.push(answerForm);
                cardForm.answerId = answerForm.id;
                cardForm.answerFormType = "new";
              })}
            >
              <span className="text-link">
                <i className="mdi mdi-plus text-inherit" /> {t("add_answer")}
              </span>
            </CardRow>
          </>
        )}
      </>
    </Screen>
  );
}
