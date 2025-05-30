import { UpgradeButton } from "../../../ui/upgrade-button.tsx";
import { t } from "../../../translations/t.ts";
import { screenStore } from "../../../store/screen-store.ts";

export function UpgradeProBlock() {
  return (
    <div className="self-stretch">
      <UpgradeButton
        onClick={() => {
          screenStore.go({ type: "plans" });
        }}
      >
        {t("upgrade_pro")}
      </UpgradeButton>
    </div>
  );
}
