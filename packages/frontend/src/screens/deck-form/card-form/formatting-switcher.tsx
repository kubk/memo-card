import { userStore } from "../../../store/user-store.ts";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { t } from "../../../translations/t.ts";
import { BooleanToggle } from "mobx-form-lite";

function CardFormattingSwitcherInner({ field }: { field: BooleanToggle }) {
  return (
    <button
      tabIndex={-1}
      onClick={() => {
        field.toggle();
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
        <ChevronIcon direction={field.value ? "top" : "bottom"} />
      </span>{" "}
      {t("formatting")}
    </button>
  );
}

export function FormattingSwitcher() {
  return <CardFormattingSwitcherInner field={userStore.isCardFormattingOn} />;
}

export function QuickCardFormattingSwitcher() {
  return (
    <CardFormattingSwitcherInner field={userStore.isQuizzCardFormattingOn} />
  );
}
