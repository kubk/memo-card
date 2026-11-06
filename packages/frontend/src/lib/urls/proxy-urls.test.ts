import { afterEach, describe, expect, it, vi } from "vitest";
import { links } from "api";

const importWithOrigin = async (origin: string) => {
  vi.resetModules();
  vi.stubGlobal("location", new URL(origin));
  const { env } = await import("../../env.ts");
  const proxyUrls = await import("./proxy-urls.ts");
  return { env, ...proxyUrls };
};

describe("proxy urls", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps canonical urls outside the proxy host", async () => {
    const { apiUrl, toViewerMediaUrls, env } = await importWithOrigin(
      "https://app.memocard.org",
    );
    const html = `<img src="${links.media}/a.jpg">`;

    expect(apiUrl).toBe(env.VITE_API_URL);
    expect(toViewerMediaUrls(html)).toBe(html);
  });

  it("routes api and media through the proxy host", async () => {
    const { apiUrl, toViewerMediaUrls } = await importWithOrigin(
      "https://ru-app.memocard.org",
    );

    expect(apiUrl).toBe("https://ru-app.memocard.org/api");
    expect(
      toViewerMediaUrls(
        `<img src="${links.media}/a.jpg"><img src="${links.media}/b.jpg">`,
      ),
    ).toBe(
      '<img src="https://ru-app.memocard.org/media/a.jpg"><img src="https://ru-app.memocard.org/media/b.jpg">',
    );
  });
});
