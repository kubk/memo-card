import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "../../lib/mobx-query-lite/cache.ts";
import { queryRegistry } from "../../lib/mobx-query-lite/make-query.ts";
import { CardPreviewScreen } from "./card-preview-screen.tsx";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  deckWithCards: vi.fn(),
  myDecks: [] as unknown[],
  publicDecks: [] as unknown[],
  screen: {
    type: "cardPreviewId",
    cardId: 1,
    deckId: 42,
  },
}));

vi.mock("../../api/trpc-api.ts", () => ({
  api: {
    deck: {
      deckWithCards: { query: mocks.deckWithCards },
    },
  },
}));

vi.mock("../../store/deck-list-store.ts", () => ({
  deckListStore: {
    get myDecks() {
      return mocks.myDecks;
    },
    get publicDecks() {
      return mocks.publicDecks;
    },
  },
}));

vi.mock("../../store/screen-store.ts", () => ({
  screenStore: {
    back: mocks.back,
    get screen() {
      return mocks.screen;
    },
  },
}));

vi.mock("../../lib/platform/use-progress.tsx", () => ({
  useProgress: () => undefined,
}));

vi.mock("../deck-form/card-form/create-mock-card-preview-form.ts", () => ({
  createMockCardPreviewForm: (card: { front: string }) => ({
    cardForm: { front: { value: card.front } },
  }),
}));

vi.mock("../deck-form/card-form/card-preview.tsx", () => ({
  CardPreview: ({
    form,
  }: {
    form: { cardForm: { front: { value: string } } | null };
  }) => <div>{form.cardForm?.front.value}</div>,
}));

vi.mock("../error-screen/error-screen.tsx", () => ({
  ErrorScreen: () => <div>Error</div>,
}));

const completeDeck = {
  id: 42,
  createdAt: "2026-01-01T00:00:00.000Z",
  name: "Travel English",
  authorId: 2,
  description: "Airport and hotel phrases",
  shareId: "travel",
  isPublic: true,
  speakLocale: null,
  speakField: null,
  speakAutoAi: false,
  reverseCards: false,
  cardInputModeId: null,
  availableIn: "en",
  categoryId: null,
  deckCategory: undefined,
  deckCards: [
    {
      id: 1,
      createdAt: "2026-01-01T00:00:00.000Z",
      deckId: 42,
      front: "Airport",
      back: "Аэропорт",
      example: null,
      answerType: "remember" as const,
      answers: null,
      options: null,
    },
  ],
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve: Deferred<T>["resolve"] = () => undefined;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

describe("CardPreviewScreen", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.myDecks.length = 0;
    mocks.publicDecks.length = 0;
    queryRegistry.clear();
    inMemoryCache.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  it("loads a card from deck details for a direct non-author route", async () => {
    const request = createDeferred<typeof completeDeck>();
    mocks.deckWithCards.mockReturnValue(request.promise);

    await act(async () => {
      root.render(<CardPreviewScreen />);
    });

    expect(mocks.deckWithCards).toHaveBeenCalledWith({ deckId: 42 });
    expect(container.textContent).toBe("");

    await act(async () => {
      request.resolve(completeDeck);
      await request.promise;
    });

    expect(container.textContent).toBe("Airport");
  });

  it("uses an owned deck without loading deck details", async () => {
    mocks.myDecks.push({
      ...completeDeck,
      cardsToReview: [],
    });

    await act(async () => {
      root.render(<CardPreviewScreen />);
      await Promise.resolve();
    });

    expect(container.textContent).toBe("Airport");
    expect(mocks.deckWithCards).not.toHaveBeenCalled();
  });
});
