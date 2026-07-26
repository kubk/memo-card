import { useState } from "react";
import {
  assert,
  calcPlanPriceForDuration,
  formatDiscountAsText,
  getPlanDiscountForDuration,
  links,
  PaymentMethodType,
  translateProDuration,
  type PlanDuration,
} from "api";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { userStore } from "../../store/user-store.ts";
import { t, translator } from "../../translations/t.ts";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { cn } from "../../ui/cn.ts";
import { ExternalLink } from "../../ui/external-link.tsx";
import { Flex } from "../../ui/flex.tsx";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { Label } from "../../ui/label.tsx";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { Screen } from "../shared/screen.tsx";
import { IconTelegramStar } from "./icon-telegram-star.tsx";
import { ProPage } from "./pro-page.tsx";
import { PlansScreenStore } from "./store/plans-screen-store.ts";
import { Tag } from "./tag.tsx";

export function PlansScreen() {
  const [store] = useState(() => new PlansScreenStore());

  useBackButton(() => {
    screenStore.back();
  });

  useMainButton(
    () => (store.isPaymentOptionsOpen ? store.buyText : t("upgrade_pro")),
    store.handleMainButtonClick,
    () => store.isMainButtonVisible,
    [],
    {
      hasShineEffect: true,
      isAboveBottomSheet: true,
    },
  );

  useProgress(() => store.isCreatingOrder);

  if (!store.hasLoadedPlans) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <ProPlansScreen />
      <PaymentOptionsSheet store={store} />
    </>
  );
}

function ProPlansScreen() {
  return (
    <Screen>
      <ProPage flush footer={<TermsNotice />} />
    </Screen>
  );
}

function PaymentOptionsSheet({ store }: { store: PlansScreenStore }) {
  return (
    <BottomSheet
      background="secondary"
      headerSpacing="compact"
      isOpen={store.isPaymentOptionsOpen}
      onClose={store.closePaymentOptions}
      title={t("payment_title")}
    >
      <div className="-mx-5 -mb-5 flex max-h-[calc(var(--tg-viewport-height,100vh)_-_80px)] flex-col gap-4 overflow-y-auto bg-secondary-bg px-5 pb-28 pt-2">
        <PaymentOptions store={store} />
      </div>
    </BottomSheet>
  );
}

function PaymentOptions({ store }: { store: PlansScreenStore }) {
  const selectedPlan = store.selectedPlan;
  const durationDisplayMethod = store.durationDisplayMethod;
  const bankCardDiscountText = formatDiscountAsText(
    store.bankCardDiscount,
    translator.getLang(),
  );

  return (
    <>
      <Label fullWidth text={t("payment_choose_method")}>
        <RadioList<PaymentMethodType | null>
          selectedId={store.method}
          options={[
            ...(store.isUsdPaymentAvailable
              ? [
                  {
                    id: PaymentMethodType.Usd,
                    title: (
                      <Flex gap={4}>
                        {t("payment_method_usd")}
                        {bankCardDiscountText ? (
                          <Tag text={bankCardDiscountText} />
                        ) : null}
                      </Flex>
                    ),
                  },
                ]
              : []),
            {
              id: PaymentMethodType.Stars,
              title: t("payment_method_stars"),
            },
          ]}
          onChange={store.updateMethod}
        />
      </Label>

      <Label
        fullWidth
        text={
          durationDisplayMethod === PaymentMethodType.Usd
            ? t("payment_choose_subscription")
            : t("payment_choose_duration")
        }
      >
        <RadioList<PlanDuration | null>
          selectedId={store.selectedPlanDuration.value}
          options={store.availablePlanDurations.map((duration) => {
            assert(selectedPlan);

            const discount = getPlanDiscountForDuration(
              durationDisplayMethod,
              selectedPlan,
              duration,
            );

            return {
              id: duration,
              title: (
                <div className="flex gap-2">
                  <span>
                    {translateProDuration(duration, translator.getLang())}
                  </span>
                  {discount > 0 ? (
                    <Tag
                      text={formatDiscountAsText(
                        discount,
                        translator.getLang(),
                      )}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "ms-auto flex gap-1 pe-2 text-hint",
                      userStore.isRtl && "flex-row-reverse",
                    )}
                  >
                    {durationDisplayMethod === PaymentMethodType.Usd
                      ? "$"
                      : null}
                    {calcPlanPriceForDuration(
                      durationDisplayMethod,
                      selectedPlan,
                      duration,
                    )}
                    {durationDisplayMethod === PaymentMethodType.Stars ? (
                      <div className="mt-0.5 h-4 w-4">
                        <IconTelegramStar />
                      </div>
                    ) : null}
                  </div>
                </div>
              ),
            };
          })}
          onChange={store.selectedPlanDuration.onChange}
        />
      </Label>
    </>
  );
}

function TermsNotice() {
  return (
    <div className="w-full px-3 pb-2 text-sm text-hint">
      <TermsText />
    </div>
  );
}

function TermsText() {
  return (
    <>
      {t("payment_tos_and_pp_agree")}
      <ExternalLink href={links.tosPath}>{t("payment_tos")}</ExternalLink>
      {t("payment_and")}
      <ExternalLink href={links.privacyPolicyPath}>
        {t("payment_pp")}
      </ExternalLink>
    </>
  );
}
