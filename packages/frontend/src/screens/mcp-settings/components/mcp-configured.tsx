import { CheckIcon, TrashIcon } from "lucide-react";
import { sharedProTitle } from "api";
import { t } from "../../../translations/t.ts";
import { td } from "../../../translations/td.tsx";
import { List } from "../../../ui/list.tsx";
import { LoadingSwap } from "../../../ui/loading-swap.tsx";
import { ProIcon } from "../../../ui/pro-icon.tsx";
import { ButtonLink } from "../../../ui/button-link.tsx";
import { useMcpWizardStore } from "../store/mcp-wizard-store-context.tsx";

export function McpConfigured() {
  const store = useMcpWizardStore();
  const plan = store.accountStore.plan;
  const paidUntil = store.accountStore.paidUntil;

  return (
    <>
      <div className="flex size-[150px] items-center justify-center rounded-full bg-button-outline-bg-light text-link dark:bg-button-outline-bg-dark">
        <CheckIcon size={70} strokeWidth={1.8} />
      </div>
      <h2 className="mt-6 text-center text-[28px] font-bold leading-tight">
        {t("configuredTitle")}
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
                      {td(store.planDateMessageKey, {
                        date: () => <bdi>{paidUntil}</bdi>,
                      })}
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
      <ButtonLink
        className="mt-4 text-[17px] font-medium"
        onClick={store.openGuide}
        type="button"
      >
        {t("guideLink")}
      </ButtonLink>
    </>
  );
}
