import { userStore } from "../../../store/user-store.ts";
import { ButtonSideAligned } from "../../../ui/button-side-aligned.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { t } from "../../../translations/t.ts";
import { StarIcon } from "lucide-react";

export function MoreFeaturesButton() {
  return userStore.isPaid ? null : (
    <ButtonSideAligned
      icon={<StarIcon size={24} />}
      outline
      onClick={() => {
        screenStore.go({ type: "plans" });
      }}
    >
      {t("more_features")}
    </ButtonSideAligned>
  );
}
