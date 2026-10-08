import { act } from "preact/test-utils";
import { createRoot } from "preact/compat/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackBottomButton } from "./back-bottom-button.tsx";

const mocks = vi.hoisted(() => {
  class BrowserPlatform {
    isMobile = true;
  }

  return {
    BrowserPlatform,
    platform: new BrowserPlatform(),
  };
});

vi.mock("../../lib/platform/platform.ts", () => ({
  platform: mocks.platform,
}));

vi.mock("../../lib/platform/browser/browser-platform.ts", () => ({
  BrowserPlatform: mocks.BrowserPlatform,
}));

vi.mock("../../lib/platform/telegram/telegram-platform.ts", () => ({
  TelegramPlatform: class TelegramPlatform {},
}));

vi.mock("../../translations/t.ts", () => ({
  t: () => "Back",
}));

describe("BackBottomButton", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    mocks.platform.isMobile = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  async function renderButtonWithInput() {
    await act(async () => {
      root.render(
        <>
          <input />
          <BackBottomButton onClick={() => undefined} />
        </>,
      );
    });

    const input = container.querySelector("input");
    expect(input).not.toBeNull();
    return input as HTMLInputElement;
  }

  it("hides while a text input is focused on mobile", async () => {
    const input = await renderButtonWithInput();

    expect(container.querySelector("button")?.textContent).toBe("Back");

    await act(async () => {
      input.focus();
    });

    expect(container.querySelector("button")).toBeNull();

    await act(async () => {
      input.blur();
    });

    expect(container.querySelector("button")?.textContent).toBe("Back");
  });

  it("stays visible while a text input is focused on desktop", async () => {
    mocks.platform.isMobile = false;
    const input = await renderButtonWithInput();

    await act(async () => {
      input.focus();
    });

    expect(container.querySelector("button")?.textContent).toBe("Back");
  });
});
