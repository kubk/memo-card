import { test, vi, expect } from "vitest";
import { AiMassCreationStore } from "./ai-mass-creation-store.ts";
import { when } from "mobx";
import { isFormValid } from "mobx-form-lite";

const aiUserCredentialsCheckRequestMock = vi.hoisted(() => vi.fn());

vi.mock("../../../api/api.ts", () => {
  return {
    aiUserCredentialsCheckRequest: aiUserCredentialsCheckRequestMock,
    upsertUserAiCredentialsRequest: vi.fn(() => Promise.resolve()),
    aiMassGenerateRequest: vi.fn(() => Promise.resolve()),
    addCardsMultipleRequest: vi.fn(() => Promise.resolve()),
  };
});

vi.mock("../../../translations/t.ts", () => {
  return {
    t: (key: string) => key,
  };
});

vi.mock("../../shared/snackbar.tsx", () => {
  return {
    showSnackBar: vi.fn(),
  };
});

vi.mock("../../../lib/telegram/show-confirm.ts", () => {
  return {
    showConfirm: vi.fn(),
  };
});

vi.mock("../../../store/deck-list-store.ts", () => {
  return {
    deckListStore: {},
  };
});

test("ai mass creation store - api keys form - initial state", async () => {
  aiUserCredentialsCheckRequestMock.mockResolvedValueOnce(
    Promise.resolve({
      is_ai_credentials_set: false,
    }),
  );
  const store = new AiMassCreationStore();
  store.load();
  await when(() => store.isApiKeysSetRequest.isSuccess);
  expect(store.isApiKeysSet).toBeFalsy();
  expect(store.isApiKeyRegularInput).toBeTruthy();
  expect(isFormValid(store.apiKeysForm)).toBeFalsy();
  store.apiKeysForm.apiKey.onChange("test");
  expect(isFormValid(store.apiKeysForm)).toBeTruthy();
});

test("ai mass creation store - api keys form - api key is configured", async () => {
  aiUserCredentialsCheckRequestMock.mockResolvedValueOnce(
    Promise.resolve({
      is_ai_credentials_set: true,
    }),
  );
  const store = new AiMassCreationStore();
  store.load();
  await when(() => store.isApiKeysSetRequest.isSuccess);
  expect(store.isApiKeysSet).toBeTruthy();
  expect(store.isApiKeyRegularInput).toBeFalsy();
  expect(isFormValid(store.apiKeysForm)).toBeTruthy();

  store.forceUpdateApiKey.setTrue();
  expect(store.isApiKeyRegularInput).toBeTruthy();
  expect(isFormValid(store.apiKeysForm)).toBeFalsy();
  store.apiKeysForm.apiKey.onChange("test");
  expect(isFormValid(store.apiKeysForm)).toBeTruthy();
});
