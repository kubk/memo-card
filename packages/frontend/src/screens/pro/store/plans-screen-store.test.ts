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

  it("starts with a visible Pro upgrade button and no payment selection", async () => {
    const store = new PlansScreenStore();

    await waitForPlans(store);

    expect(store.method).toBeNull();
    expect(store.durationDisplayMethod).toBe(PaymentMethodType.Usd);
    expect(store.availablePlanDurations).toEqual([1, 6, 12]);
    expect(store.selectedPlanDuration.value).toBeNull();
    expect(store.isMainButtonVisible).toBe(true);
    expect(store.isPaymentOptionsOpen).toBe(false);
  });

  it("opens payment options with bank card and 1 month selected", async () => {
    const store = new PlansScreenStore();
    await waitForPlans(store);

    store.openPaymentOptions();

    expect(store.isPaymentOptionsOpen).toBe(true);
    expect(store.method).toBe(PaymentMethodType.Usd);
    expect(store.selectedPlanDuration.value).toBe(1);
    expect(store.isMainButtonVisible).toBe(true);
  });

  it("creates a Stripe Checkout Session for USD payments", async () => {
    mocks.stripeOrderPlan.mockResolvedValue({
      checkoutUrl: "https://checkout.stripe.com/test",
    });
    const store = new PlansScreenStore();
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
    const store = new PlansScreenStore();
    await waitForPlans(store);

    store.updateMethod(PaymentMethodType.Stars);

    expect(store.durationDisplayMethod).toBe(PaymentMethodType.Stars);
    expect(store.availablePlanDurations).toEqual([1, 6, 12]);
  });
});
