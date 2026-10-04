import { t } from "../../translations/t.ts";
import { screenStore } from "../../store/screen-store.ts";

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
          screenStore.push({ type: "main" });
        }}
      >
        {t("new_cards_count", { count: newCardsCount })}
      </span>{" "}
      {t("review_finished_to_review")}
    </>
  );
}
