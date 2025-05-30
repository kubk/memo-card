import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { Flex } from "../../ui/flex.tsx";
import { useState } from "react";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { Hint } from "../../ui/hint.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { PlansScreenStore, PreviewItem } from "./store/plans-screen-store.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { userStore } from "../../store/user-store.ts";
import { ExternalLink } from "../../ui/external-link.tsx";
import { t, translator } from "../../translations/t.ts";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { cn } from "../../ui/cn.ts";
import { theme } from "../../ui/theme.tsx";
import {
  calcPlanPriceForDuration,
  durationsWithDiscount,
  PlanDuration,
} from "api";
import { Tag } from "./tag.tsx";
import { Label } from "../../ui/label.tsx";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { translateProDuration } from "api";
import { translateProDescription } from "api";
import { assert } from "api";
import { links } from "api";
import { MassCreationPreview } from "../shared/feature-preview/mass-creation-preview.tsx";
import { IndividualCardAiPreview } from "../shared/feature-preview/individual-card-ai-preview.tsx";
import { AiSpeechPreview } from "../shared/feature-preview/ai-speech-preview.tsx";
import { suitableCardInputModeStore } from "../../store/suitable-card-input-mode-store.ts";
import { sharedProTitle } from "api";
import { IconTelegramStar } from "./icon-telegram-star.tsx";
import { PaymentMethodType } from "api";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { formatDiscountAsText } from "api";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Copy,
  Link,
  Mic,
  Zap,
} from "lucide-react";

const planItems: Array<{
  icon: React.ReactNode;
  iconColor: string;
  previewItem?: PreviewItem;
}> = [
  {
    iconColor: theme.icons.pink,
    icon: <Bot size={18} />,
    previewItem: "individual_ai_card",
  },
  {
    iconColor: theme.icons.violet,
    icon: <Zap size={18} />,
    previewItem: "bulk_ai_cards",
  },
  {
    iconColor: theme.icons.blue,
    icon: <Mic size={18} />,
    previewItem: "ai_speech",
  },
  { iconColor: theme.icons.turquoise, icon: <Copy size={18} /> },
  { iconColor: theme.icons.sea, icon: <Link size={18} /> },
];

export function PlansScreen() {
  const [store] = useState(() => new PlansScreenStore());
  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    store.load();
    suitableCardInputModeStore.load();
  });

  useMainButton(
    () => store.buyText,
    () => {
      store.createOrder();
    },
    () => store.isBuyButtonVisible,
    [],
    {
      hasShineEffect: true,
    },
  );

  useProgress(() => store.createOrderRequest.isLoading);

  if (store.plansRequest.result.status !== "success") {
    return <FullScreenLoader />;
  }

  const planDescription = translateProDescription(translator.getLang());

  return (
    <Screen title={sharedProTitle}>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={16}
        mt={4}
        mb={52}
        fullWidth
      >
        {userStore.paidUntil ? (
          <div className={cn("w-full")}>
            <Hint>
              <Flex direction={"column"}>
                <div>
                  {t("payment_paid_until")}: {userStore.paidUntil}
                </div>
                <div>
                  {t("ai_cards_left")}: {store.aiCardsLeft}
                </div>
              </Flex>
            </Hint>
          </div>
        ) : null}

        <Label text={t("payment_included")} fullWidth>
          <List
            items={planItems.map((item, i) => ({
              onClick: () => {
                store.previewPlanFeature(item.previewItem);
              },
              icon: (
                <FilledIcon backgroundColor={item.iconColor} icon={item.icon} />
              ),
              text: (
                <Flex direction={"column"}>
                  <div>{planDescription[i].title}</div>
                  <div className="text-sm text-hint pr-4">
                    {planDescription[i].description}
                  </div>
                </Flex>
              ),
              right: item.previewItem ? (
                <div className="text-hint">
                  {userStore.isRtl ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </div>
              ) : undefined,
            }))}
          />
        </Label>

        {platform instanceof BrowserPlatform && (
          <Label fullWidth text={t("payment_choose_method")}>
            <RadioList
              selectedId={store.method}
              options={[
                {
                  id: PaymentMethodType.Usd,
                  title: (
                    <Flex gap={4}>
                      {t("payment_method_usd")}
                      <Tag
                        text={formatDiscountAsText(
                          store.bankCardDiscount,
                          translator.getLang(),
                        )}
                      />
                    </Flex>
                  ),
                },
                {
                  id: PaymentMethodType.Stars,
                  title: t("payment_method_stars"),
                },
              ]}
              onChange={(method) => {
                store.updateMethod(method);
              }}
            />
          </Label>
        )}

        <Label
          fullWidth
          text={
            store.method === PaymentMethodType.Usd
              ? t("payment_choose_subscription")
              : t("payment_choose_duration")
          }
        >
          <RadioList<PlanDuration | null>
            selectedId={store.selectedPlanDuration.value}
            options={durationsWithDiscount
              .filter((duration) => {
                if (
                  store.method === PaymentMethodType.Usd &&
                  duration.duration === 6
                ) {
                  return false;
                }

                return true;
              })
              .map((durationsWithDiscount) => {
                const proPlan = store.proPlan;
                assert(proPlan);

                const discount =
                  store.method === PaymentMethodType.Stars
                    ? durationsWithDiscount.discountStars
                    : durationsWithDiscount.discount;

                return {
                  id: durationsWithDiscount.duration,
                  title: (
                    <div className="flex gap-2">
                      <span>
                        {translateProDuration(
                          durationsWithDiscount.duration,
                          translator.getLang(),
                          store.method,
                        )}
                      </span>
                      {discount > 0 && (
                        <Tag
                          text={formatDiscountAsText(
                            discount,
                            translator.getLang(),
                          )}
                        />
                      )}
                      <div className="flex gap-1 text-hint ml-auto pr-2">
                        {store.method === PaymentMethodType.Usd ? "$" : null}
                        {calcPlanPriceForDuration(
                          store.method,
                          proPlan,
                          durationsWithDiscount.duration,
                        )}
                        {store.method === PaymentMethodType.Stars ? (
                          <div className="w-4 h-4 mt-0.5">
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

        <div className="w-full">
          <Hint>
            {t("payment_tos_and_pp_agree")}
            <ExternalLink href={links.tosPath}>{t("payment_tos")}</ExternalLink>
            {t("payment_and")}
            <ExternalLink href={links.privacyPolicyPath}>
              {t("payment_pp")}
            </ExternalLink>
          </Hint>
        </div>
      </Flex>

      <IndividualCardAiPreview
        isOpen={store.selectedPreviewPlanFeature === "individual_ai_card"}
        onClose={store.quitPreviewPlanFeature}
        viewMode={suitableCardInputModeStore.viewMode}
      />

      <MassCreationPreview
        onClose={store.quitPreviewPlanFeature}
        isOpen={store.selectedPreviewPlanFeature === "bulk_ai_cards"}
      />

      <AiSpeechPreview
        isOpen={store.selectedPreviewPlanFeature === "ai_speech"}
        onClose={store.quitPreviewPlanFeature}
      />
    </Screen>
  );
}
