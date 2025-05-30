import { userStore } from "../../../store/user-store.ts";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { t } from "../../../translations/t.ts";

export function FormattingSwitcher() {
  return (
    <button
      tabIndex={-1}
      onClick={() => {
        userStore.isCardFormattingOn.toggle();
      }}
      className="reset-button text-base text-link cursor-pointer"
    >
      <span
        className="inline-block"
        style={{
          transform: "translateY(2px)",
        }}
      >
        {" "}
        <ChevronIcon
          direction={userStore.isCardFormattingOn.value ? "top" : "bottom"}
        />
      </span>{" "}
      {t("formatting")}
    </button>
  );
}
