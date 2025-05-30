import { t } from "../../translations/t.ts";
import { screenStore } from "../../store/screen-store.ts";
import { translateNewCardsCount } from "../../translations/translate-new-cards-count.tsx";

type Props = {
  newCardsCount?: number | null;
};

export function WantMoreCardsButton(props: Props) {
  const { newCardsCount } = props;

  if (!newCardsCount) {
    return null;
  }

  return (
    <>
      {t("review_finished_want_more")}{" "}
      <span
        className="text-link cursor-pointer"
        onClick={() => {
          screenStore.go({ type: "main" });
        }}
      >
        {translateNewCardsCount(newCardsCount)}
      </span>{" "}
      {t("review_finished_to_review")}
    </>
  );
}
