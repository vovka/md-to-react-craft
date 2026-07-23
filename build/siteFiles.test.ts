import path from "node:path";
import { describe, expect, it } from "vitest";
import { createRobots, createSitemap, discoverCanonicalRoutes } from "./siteFiles";

const posts = path.resolve(__dirname, "../src/content/posts");
const routes = discoverCanonicalRoutes(posts);

describe("site discovery files", () => {
  it("includes canonical pages and every Markdown article", () => {
    expect(routes).toEqual(expect.arrayContaining([
      "/",
      "/about",
      "/contact",
      "/privacy",
      "/we-no-longer-own-the-code",
    ]));
    expect(routes.filter((route) => route !== "/")).toHaveLength(new Set(routes.slice(1)).size);
  });

  it("builds a production sitemap from the production canonical origin", () => {
    const sitemap = createSitemap("https://blog.shcherbyna.me", routes);
    expect(sitemap).toContain("<loc>https://blog.shcherbyna.me/</loc>");
    expect(sitemap).toContain("<loc>https://blog.shcherbyna.me/we-no-longer-own-the-code</loc>");
    expect(sitemap).not.toContain("test.blog.shcherbyna.me");
  });

  it("keeps the test profile discoverable but non-indexable", () => {
    const siteUrl = "https://test.blog.shcherbyna.me";
    expect(createRobots(siteUrl, false)).toContain("Disallow: /");
    expect(createRobots(siteUrl, false)).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
    expect(createSitemap(siteUrl, routes)).toContain(`<loc>${siteUrl}/privacy</loc>`);
  });

  it("allows production crawling and advertises its sitemap", () => {
    const robots = createRobots("https://blog.shcherbyna.me", true);
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://blog.shcherbyna.me/sitemap.xml");
  });
});
