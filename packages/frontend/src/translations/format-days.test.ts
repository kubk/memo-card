import { languagesShared } from "api";
import { t, translationResourceStore } from "./t.ts";
import { beforeAll, describe, expect, test, vi } from "vitest";

const lang = vi.hoisted(() => vi.fn());
vi.mock("../store/user-store.ts", () => ({
  userStore: {
    get language() {
      return lang();
    },
  },
}));
beforeAll(async () => {
  await Promise.all(
    languagesShared.map((language) => translationResourceStore.load(language)),
  );
});

describe("format days", () => {
  test("russian", () => {
    lang.mockReturnValue("ru");

    expect(t("days_count", { days: 0 })).toBe("0 дней");
    expect(t("days_count", { days: 1 })).toBe("1 день");
    expect(t("days_count", { days: 2 })).toBe("2 дня");
    expect(t("days_count", { days: 5 })).toBe("5 дней");
    expect(t("days_count", { days: 21 })).toBe("21 день");
  });

  test("english", () => {
    lang.mockReturnValue("en");

    expect(t("days_count", { days: 0 })).toBe("0 days");
    expect(t("days_count", { days: 1 })).toBe("1 day");
    expect(t("days_count", { days: 2 })).toBe("2 days");
  });

  test("brazilian portuguese", () => {
    lang.mockReturnValue("pt-br");

    expect(t("days_count", { days: 0 })).toBe("0 dias");
    expect(t("days_count", { days: 1 })).toBe("1 dia");
    expect(t("days_count", { days: 2 })).toBe("2 dias");
  });
});
