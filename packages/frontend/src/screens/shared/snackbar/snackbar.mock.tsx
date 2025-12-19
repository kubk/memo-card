import { vi } from "vitest";

export function snackbarMock() {
  return {
    notifyError: vi.fn(),
    notifySuccess: vi.fn(),
  };
}
