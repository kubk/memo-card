import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentMethodType, plans } from "api";
import { PlansScreenStore } from "./plans-screen-store.ts";
import { when } from "mobx";
import { queryRegistry } from "../../../lib/mobx-query-lite/make-query.ts";
import { inMemoryCache } from "../../../lib/mobx-query-lite/cache.ts";

const mocks = vi.hoisted(() => ({
  plansQuery: vi.fn(),
  starsOrderPlan: vi.fn(),
  stripeOrderPlan: vi.fn(),
  openExternalLink: vi.fn(),
}));

vi.mock("../../../api/trpc-api.ts", () => {
  return {
    api: {
      plans: {
        query: mocks.plansQuery,
      },
      starsOrderPlan: {
        mutate: mocks.starsOrderPlan,
      },
      stripeOrderPlan: {
        mutate: mocks.stripeOrderPlan,
      },
    },
    apiProxy: {
      plans: {
        query: () => ({ key: "plans", query: mocks.plansQuery }),
      },
    },
  };
});

vi.mock("../translations.ts", () => ({
  getBuyText: vi.fn(() => "Buy"),
}));

vi.mock("../../shared/snackbar/snackbar.tsx", () => ({
  notifyError: vi.fn(),
}));

vi.mock("../../../lib/platform/platform.ts", () => ({
  platform: {
    openExternalLink: mocks.openExternalLink,
  },
}));

describe("PlansScreenStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryRegistry.clear();
    inMemoryCache.clear();
    mocks.plansQuery.mockResolvedValue({
      plans: [plans.pro, plans.teacher],
    });
  });

  async function waitForPlans(store: PlansScreenStore) {
    await when(() => store.hasLoadedPlans);
  }

  it("starts with no selected payment method but displays USD durations", async () => {
    const store = new PlansScreenStore("pro");

    await waitForPlans(store);

    expect(store.method).toBeNull();
    expect(store.durationDisplayMethod).toBe(PaymentMethodType.Usd);
    expect(store.availablePlanDurations).toEqual([1, 6, 12]);
    expect(store.selectedPlanDuration.value).toBeNull();
    expect(store.isBuyButtonVisible).toBe(false);
  });

  it("shows the buy button only after method and duration are selected", async () => {
    const store = new PlansScreenStore("pro");
    await waitForPlans(store);

    store.selectedPlanDuration.onChange(6);

    expect(store.isBuyButtonVisible).toBe(false);

    store.updateMethod(PaymentMethodType.Usd);

    expect(store.isBuyButtonVisible).toBe(true);
  });

  it("creates a Stripe Checkout Session for USD payments", async () => {
    mocks.stripeOrderPlan.mockResolvedValue({
      checkoutUrl: "https://checkout.stripe.com/test",
    });
    const store = new PlansScreenStore("pro");
    await waitForPlans(store);
    store.selectedPlanDuration.onChange(1);
    store.updateMethod(PaymentMethodType.Usd);

    await store.createOrder();

    expect(mocks.stripeOrderPlan).toHaveBeenCalledWith({
      planType: "pro",
      duration: "1",
    });
    expect(mocks.openExternalLink).toHaveBeenCalledWith(
      "https://checkout.stripe.com/test",
    );
  });

  it("switches duration display to Stars without changing duration options", async () => {
    const store = new PlansScreenStore("pro");
    await waitForPlans(store);

    store.updateMethod(PaymentMethodType.Stars);

    expect(store.durationDisplayMethod).toBe(PaymentMethodType.Stars);
    expect(store.availablePlanDurations).toEqual([1, 6, 12]);
  });
});
