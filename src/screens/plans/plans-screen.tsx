import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Flex } from "../../ui/flex.tsx";
import React, { useState } from "react";
import { PlanItem } from "./plan-item.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { Hint } from "../../ui/hint.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { getPlanDescription, getPlanFullTile } from "./translations.ts";
import { PlansScreenStore } from "./store/plans-screen-store.ts";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { userStore } from "../../store/user-store.ts";
import { DateTime } from "luxon";
import { ExternalLink } from "../../ui/external-link.tsx";

export const PlansScreen = observer(() => {
  const [store] = useState(() => new PlansScreenStore());
  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    store.load();
  });

  useMainButton(
    () => store.buyText,
    () => {
      store.createOrder();
    },
    () => store.isBuyButtonVisible,
  );

  useTelegramProgress(() => store.isCreatingOrder);

  if (store.plansRequest?.state === "pending") {
    return <FullScreenLoader />;
  }

  return (
    <Screen title={"Plans"}>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={16}
        mt={4}
        mb={16}
        fullWidth
      >
        <Flex direction={"column"} gap={16} fullWidth>
          {store.plans.map((plan) => {
            const paidPlan = userStore.plans?.find(
              (p) => p.plan_id === plan.id,
            );
            const paidUntil = paidPlan?.until_date
              ? DateTime.fromISO(paidPlan.until_date).toLocaleString(
                  DateTime.DATE_FULL,
                )
              : undefined;

            return (
              <PlanItem
                key={plan.id}
                title={getPlanFullTile(plan)}
                isSelected={store.selectedPlanId === plan.id}
                paidUntil={paidUntil}
                description={getPlanDescription(plan)}
                onClick={() => {
                  if (!paidUntil) {
                    store.selectPlan(plan.id);
                  }
                }}
              />
            );
          })}
        </Flex>
        <Hint>
          By purchasing MemoCard you agree to the{" "}
          <ExternalLink href={"/terms-of-service.html"}>
            Terms of Service
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href={"/privacy-policy.html"}>
            Privacy Policy
          </ExternalLink>
          .
        </Hint>
      </Flex>
    </Screen>
  );
});
