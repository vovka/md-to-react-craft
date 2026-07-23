import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { siteConfig } from "@/config/site";
import RouteMetadata from "./RouteMetadata";

const renderRoute = (path: string) => render(
  <MemoryRouter
    initialEntries={[path]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <RouteMetadata />
  </MemoryRouter>,
);

describe("RouteMetadata", () => {
  afterEach(cleanup);
  it("sets article title, canonical URL, Open Graph type, and safe robots", async () => {
    renderRoute("/we-no-longer-own-the-code");
    await waitFor(() => expect(document.title).toContain("We No Longer Own the Code"));
    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href)
      .toBe(`${siteConfig.baseUrl}/we-no-longer-own-the-code`);
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("article");
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, nofollow");
  });

  it("always marks unknown routes noindex", async () => {
    renderRoute("/missing-page");
    await waitFor(() => expect(document.title).toContain("Page not found"));
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, nofollow");
  });
});
