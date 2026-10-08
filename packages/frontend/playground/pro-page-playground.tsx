import { useState } from "preact/compat";
import { type RouterOutput } from "api";
import { makeMutation } from "../src/lib/mobx-query-lite/make-mutation.ts";
import { makeQuery } from "../src/lib/mobx-query-lite/make-query.ts";
import { formatPaidUntil } from "../src/screens/pro/format-paid-until.tsx";
import { McpSettingsWizard } from "../src/screens/mcp-settings/mcp-settings-wizard.tsx";
import { McpWizardStore } from "../src/screens/mcp-settings/store/mcp-wizard-store.ts";
import { ProPage } from "../src/screens/pro/pro-page.tsx";
import { BrowserMainButton } from "../src/screens/shared/browser-platform/browser-main-button.tsx";
import { cn } from "../src/ui/cn.ts";
import { ShadcnLabel } from "../src/ui/shadcn/label.tsx";
import {
  ShadcnRadioGroup,
  ShadcnRadioGroupItem,
} from "../src/ui/shadcn/radio-group.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { PropGroup } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

const MCP_TOKEN =
  "mcp_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const PRO_PAGE_STATES = [
  { id: "unpaid", label: "Unpaid" },
  { id: "paid-not-connected", label: "Paid and not connected" },
  { id: "paid-connected", label: "Paid and connected" },
] as const;

type ProPageState = (typeof PRO_PAGE_STATES)[number]["id"];
const BILLING_TYPES = [
  { id: "subscription", label: "Subscription" },
  { id: "one-off", label: "One-off" },
] as const;
type BillingType = (typeof BILLING_TYPES)[number]["id"];

let fakeMcpTokenQueryId = 0;
type ActivePlanResponse = RouterOutput["activePlan"];

function isProPageState(value: string): value is ProPageState {
  return PRO_PAGE_STATES.some((state) => state.id === value);
}

function isBillingType(value: string): value is BillingType {
  return BILLING_TYPES.some((type) => type.id === value);
}

function createFakeMcpWizardStore(
  state: ProPageState,
  billingType: BillingType,
) {
  const status: "new" | "used" = state === "paid-connected" ? "used" : "new";
  const tokenQuery = makeQuery(
    {
      key: `playground-mcp-token-${fakeMcpTokenQueryId++}`,
      query: async () => ({ token: MCP_TOKEN, status }),
    },
    { staleTime: Infinity },
  );
  tokenQuery.setData({ token: MCP_TOKEN, status });

  let fakePlan: ActivePlanResponse["plan"] =
    state === "unpaid"
      ? null
      : {
          type: "pro",
          until_date: "2027-03-29T00:00:00.000Z",
          subscription:
            state === "paid-connected" && billingType === "subscription"
              ? { willRenew: true }
              : null,
        };
  const activePlanQuery = makeQuery<ActivePlanResponse>(
    {
      key: `playground-active-plan-${fakeMcpTokenQueryId++}`,
      query: async () => ({ plan: fakePlan }),
    },
    { staleTime: Infinity },
  );
  activePlanQuery.setData({ plan: fakePlan });
  const fakeUserStore = {
    activePlanQuery,
    get plan() {
      return activePlanQuery.data?.plan ?? null;
    },
    get paidUntil() {
      const plan = this.plan;
      return plan ? formatPaidUntil(plan.until_date) : null;
    },
    get canCancelSubscription() {
      return this.plan?.subscription?.willRenew ?? false;
    },
  };

  return new McpWizardStore(
    tokenQuery,
    fakeUserStore,
    makeMutation(async () => {
      if (fakePlan?.subscription) {
        fakePlan = { ...fakePlan, subscription: { willRenew: false } };
      }

      return { plan: fakePlan };
    }),
  );
}

export function ProPagePlayground() {
  const [preview, setPreview] = useState<{
    state: ProPageState;
    billingType: BillingType;
    store: McpWizardStore;
  }>(() => ({
    state: "paid-connected",
    billingType: "subscription",
    store: createFakeMcpWizardStore("paid-connected", "subscription"),
  }));

  const changeState = (value: string) => {
    if (!isProPageState(value)) {
      return;
    }

    setPreview({
      state: value,
      billingType: preview.billingType,
      store: createFakeMcpWizardStore(value, preview.billingType),
    });
  };

  const changeBillingType = (value: string) => {
    if (!isBillingType(value)) {
      return;
    }

    setPreview({
      state: preview.state,
      billingType: value,
      store: createFakeMcpWizardStore(preview.state, value),
    });
  };

  return (
    <>
      {preview.state === "unpaid" ? (
        <div className="h-full w-full overflow-y-auto">
          <ProPage />
        </div>
      ) : (
        <McpSettingsWizard
          key={`${preview.state}-${preview.billingType}`}
          store={preview.store}
        />
      )}
      <BrowserMainButton />
      <PropsPanel>
        <PropGroup label="State">
          <ShadcnRadioGroup
            className="w-full gap-1 rounded-lg bg-muted p-1"
            orientation="vertical"
            value={preview.state}
            onValueChange={changeState}
          >
            {PRO_PAGE_STATES.map((option) => {
              const id = `pro-page-state-${option.id}`;
              return (
                <div
                  className={cn(
                    "flex min-h-9 items-center gap-3 rounded-md px-3 py-2",
                    preview.state === option.id
                      ? "bg-background text-link"
                      : "text-foreground",
                  )}
                  key={option.id}
                >
                  <ShadcnRadioGroupItem id={id} value={option.id} />
                  <ShadcnLabel
                    className="min-w-0 flex-1 cursor-pointer whitespace-normal"
                    htmlFor={id}
                  >
                    {option.label}
                  </ShadcnLabel>
                </div>
              );
            })}
          </ShadcnRadioGroup>
        </PropGroup>
        {preview.state === "paid-connected" ? (
          <>
            <PropGroup label="Billing">
              <Tabs
                className="w-full"
                value={preview.billingType}
                onValueChange={changeBillingType}
              >
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                  {BILLING_TYPES.map((option) => (
                    <TabsTrigger
                      className="h-auto min-h-9 whitespace-normal px-2 py-2 text-center data-[state=active]:text-link"
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </PropGroup>
          </>
        ) : null}
      </PropsPanel>
    </>
  );
}
