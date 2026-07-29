import { beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "../../lib/mobx-query-lite/cache.ts";
import { queryRegistry } from "../../lib/mobx-query-lite/make-query.ts";
import { DeleteItemModalStore } from "./delete-item-modal-store.ts";

const mocks = vi.hoisted(() => ({
  deleteItem: vi.fn(),
  deletionInfo: vi.fn(),
  haptic: vi.fn(),
  invalidateMyInfo: vi.fn(),
  push: vi.fn(),
}));

vi.mock("../../api/trpc-api.ts", () => ({
  api: {
    libraryItem: {
      delete: { mutate: mocks.deleteItem },
      deletionInfo: { query: mocks.deletionInfo },
    },
  },
}));

vi.mock("../../lib/platform/platform.ts", () => ({
  platform: { haptic: mocks.haptic },
}));

vi.mock("../../lib/rollbar/rollbar.tsx", () => ({
  reportHandledError: vi.fn(),
}));

vi.mock("../../store/deck-list-store.ts", () => ({
  deckListStore: {
    myInfoQuery: { invalidate: mocks.invalidateMyInfo },
  },
}));

vi.mock("../../store/screen-store.ts", () => ({
  screenStore: { push: mocks.push },
}));

describe("DeleteItemModalStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryRegistry.clear();
    inMemoryCache.clear();
    mocks.deleteItem.mockResolvedValue(undefined);
    mocks.invalidateMyInfo.mockResolvedValue(undefined);
  });

  it("deletes without optional removals when deletion info fails", async () => {
    const store = new DeleteItemModalStore();
    store.open({ type: "deck", deckId: 42 });

    mocks.deletionInfo.mockRejectedValue(new Error("Unable to load"));
    await store.infoQuery.refetch();

    expect(store.infoQuery.data).toBeUndefined();
    expect(store.infoQuery.isPending).toBe(false);

    await store.submit();

    expect(mocks.deleteItem).toHaveBeenCalledWith({
      type: "deck",
      deckId: 42,
      removeForOtherUsers: false,
      removeFromPublicCatalog: false,
    });
  });
});
