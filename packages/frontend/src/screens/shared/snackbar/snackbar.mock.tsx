import { vi } from "vitest";

export function mock() {
  return {
    notifyError: vi.fn(),
    notifySuccess: vi.fn(),
  };
}
