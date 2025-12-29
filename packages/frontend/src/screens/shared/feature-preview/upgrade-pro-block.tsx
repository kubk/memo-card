import { UpgradeButton } from "../../../ui/upgrade-button.tsx";
import { t } from "../../../translations/t.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { userStore } from "../../../store/user-store.ts";

export function UpgradeProBlock() {
  return (
    <div className="self-stretch">
      <UpgradeButton
        onClick={() => {
          screenStore.go({ type: "plans" });
          userStore.closePaywall();
        }}
      >
        {t("upgrade_pro")}
      </UpgradeButton>
    </div>
  );
}
