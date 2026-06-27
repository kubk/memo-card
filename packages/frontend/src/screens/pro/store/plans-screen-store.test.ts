import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentMethodType, plans } from "api";
import { PlansScreenStore } from "./plans-screen-store.ts";
import { when } from "mobx";
import { queryRegistry } from "../../../lib/mobx-query-lite/make-query.ts";
import { inMemoryCache } from "../../../lib/mobx-query-lite/cache.ts";

const mocks = vi.hoisted(() => ({
  plansQuery: vi.fn(),
  starsOrderPlan: vi.fn(),
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
    },
  };
});

vi.mock("../translations.ts", () => ({
  getBuyText: vi.fn(() => "Buy"),
}));

vi.mock("../../shared/snackbar/snackbar.tsx", () => ({
  notifyError: vi.fn(),
}));

describe("PlansScreenStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryRegistry.clear();
    inMemoryCache.clear();
    mocks.plansQuery.mockResolvedValue({
      plans: [plans.pro, plans.teacher],
      aiCardsLeft: 10,
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
    expect(store.usdPaymentLink).toBeNull();
  });

  it("switches duration display to Stars without changing duration options", async () => {
    const store = new PlansScreenStore("pro");
    await waitForPlans(store);

    store.updateMethod(PaymentMethodType.Stars);

    expect(store.durationDisplayMethod).toBe(PaymentMethodType.Stars);
    expect(store.availablePlanDurations).toEqual([1, 6, 12]);
  });
});
