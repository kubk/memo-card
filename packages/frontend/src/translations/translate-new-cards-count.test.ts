import { describe, expect, test, vi } from "vitest";
import { translateNewCardsCount } from "./translate-new-cards-count.tsx";

const lang = vi.hoisted(() => vi.fn());
vi.mock("./t.ts", () => {
  return {
    translator: {
      getLang: lang,
    },
  };
});

describe("translate new cards count", () => {
  test("russian", () => {
    lang.mockReturnValue("ru");

    expect(translateNewCardsCount(1)).toBe("1 новая карточка");
    expect(translateNewCardsCount(2)).toBe("2 новые карточки");
    expect(translateNewCardsCount(3)).toBe("3 новые карточки");
    expect(translateNewCardsCount(5)).toBe("5 новых карточек");
    expect(translateNewCardsCount(9)).toBe("9 новых карточек");
    expect(translateNewCardsCount(15)).toBe("15 новых карточек");
    expect(translateNewCardsCount(20)).toBe("20 новых карточек");
    expect(translateNewCardsCount(21)).toBe("21 новая карточка");
  });

  test("english", () => {
    lang.mockReturnValue("en");

    expect(translateNewCardsCount(1)).toBe("1 new card");
    expect(translateNewCardsCount(2)).toBe("2 new cards");
    expect(translateNewCardsCount(3)).toBe("3 new cards");
    expect(translateNewCardsCount(21)).toBe("21 new cards");
  });

  test("spanish", () => {
    lang.mockReturnValue("es");

    expect(translateNewCardsCount(1)).toBe("1 nueva tarjeta");
    expect(translateNewCardsCount(2)).toBe("2 nuevas tarjetas");
    expect(translateNewCardsCount(3)).toBe("3 nuevas tarjetas");
    expect(translateNewCardsCount(21)).toBe("21 nuevas tarjetas");
  });

  test("brazilian portuguese", () => {
    lang.mockReturnValue("pt-br");

    expect(translateNewCardsCount(1)).toBe("1 novo cartão");
    expect(translateNewCardsCount(2)).toBe("2 novos cartões");
    expect(translateNewCardsCount(3)).toBe("3 novos cartões");
    expect(translateNewCardsCount(21)).toBe("21 novos cartões");
  });
});
