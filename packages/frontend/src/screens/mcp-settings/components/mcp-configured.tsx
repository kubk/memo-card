import { CheckIcon, TrashIcon } from "lucide-react";
import { sharedProTitle } from "api";
import { t } from "../../../translations/t.ts";
import { List } from "../../../ui/list.tsx";
import { LoadingSwap } from "../../../ui/loading-swap.tsx";
import { ProIcon } from "../../../ui/pro-icon.tsx";
import { TextButton } from "../../../ui/text-button.tsx";
import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";
import { mcpT } from "../translations.ts";

export function McpConfigured() {
  const store = useMcpWizardStore();
  const plan = store.accountStore.plan;
  const paidUntil = store.accountStore.paidUntil;
  const { before, after } = store.planDateTextParts;

  return (
    <>
      <div className="flex size-[150px] items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <CheckIcon size={70} strokeWidth={1.8} />
      </div>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {mcpT("configuredTitle")}
      </h2>
      {plan && paidUntil ? (
        <div className="mt-6 w-full">
          <List
            animateTap={false}
            items={[
              {
                icon: <ProIcon />,
                text: (
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text">
                      {sharedProTitle}
                    </span>
                    <span className="text-xs text-hint">
                      {before}
                      <bdi>{paidUntil}</bdi>
                      {after}
                    </span>
                  </div>
                ),
                isDisabled: true,
              },
              ...(store.accountStore.canCancelSubscription
                ? [
                    {
                      icon: (
                        <div className="pl-2 pr-1.5">
                          <TrashIcon className="text-danger" size={16} />
                        </div>
                      ),
                      text: (
                        <LoadingSwap
                          className="text-danger [&_svg]:size-4"
                          isLoading={store.cancelSubscriptionMutation.isPending}
                        >
                          <span className="text-sm text-danger">
                            {t("payment_cancel_subscription")}
                          </span>
                        </LoadingSwap>
                      ),
                      isDisabled: store.cancelSubscriptionMutation.isPending,
                      onClick: store.cancelSubscription,
                    },
                  ]
                : []),
            ]}
          />
          {store.cancelSubscriptionMutation.error ? (
            <p className="mt-2 px-3 text-xs text-danger">
              {t("payment_cancel_subscription_error")}
            </p>
          ) : null}
        </div>
      ) : null}
      <TextButton
        className="mt-4 underline"
        onClick={store.openGuide}
        type="button"
      >
        {mcpT("guideLink")}
      </TextButton>
    </>
  );
}
