import { afterEach, describe, expect, it, vi } from "vitest";
import { links } from "api";

const importWithOrigin = async (origin: string) => {
  vi.resetModules();
  vi.stubGlobal("location", new URL(origin));
  return import("./proxy-urls.ts");
};

describe("proxy urls", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps canonical urls outside the proxy host", async () => {
    const { toViewerMediaUrls } = await importWithOrigin(
      "https://app.memocard.org",
    );
    const html = `<img src="${links.media}/a.jpg">`;

    expect(toViewerMediaUrls(html)).toBe(html);
  });

  it("routes media through the proxy host", async () => {
    const { toViewerMediaUrls } = await importWithOrigin(
      "https://ru-app.memocard.org",
    );

    expect(
      toViewerMediaUrls(
        `<img src="${links.media}/a.jpg"><img src="${links.media}/b.jpg">`,
      ),
    ).toBe(
      '<img src="https://ru-app.memocard.org/media/a.jpg"><img src="https://ru-app.memocard.org/media/b.jpg">',
    );
  });
});
