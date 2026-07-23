import { readdirSync } from "node:fs";
import type { Plugin } from "vite";

const STATIC_ROUTES = ["/", "/about", "/contact", "/privacy"];

export interface SiteFilesOptions {
  siteUrl: string;
  indexable: boolean;
  postDirectory: string;
}

const normalizedUrl = (siteUrl: string) => siteUrl.replace(/\/$/, "");

export const discoverCanonicalRoutes = (postDirectory: string) => {
  const articles = readdirSync(postDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `/${encodeURIComponent(entry.name.replace(/\.md$/, ""))}`)
    .sort();
  return [...STATIC_ROUTES, ...articles];
};

export const createRobots = (siteUrl: string, indexable: boolean) => {
  const directive = indexable ? "Allow: /" : "Disallow: /";
  return `User-agent: *\n${directive}\nSitemap: ${normalizedUrl(siteUrl)}/sitemap.xml\n`;
};

export const createSitemap = (siteUrl: string, routes: string[]) => {
  const baseUrl = normalizedUrl(siteUrl);
  const entries = routes.map((route) => `  <url><loc>${baseUrl}${route}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
};

export const createSiteFilesPlugin = (options: SiteFilesOptions): Plugin => ({
  name: "environment-site-files",
  transformIndexHtml: (html) => html
    .replace("noindex, nofollow", options.indexable ? "index, follow" : "noindex, nofollow")
    .replaceAll("__SITE_URL__", normalizedUrl(options.siteUrl))
    .replaceAll('content="/favicon.ico"', `content="${normalizedUrl(options.siteUrl)}/favicon.ico"`),
  generateBundle() {
    const routes = discoverCanonicalRoutes(options.postDirectory);
    this.emitFile({ type: "asset", fileName: "robots.txt", source: createRobots(options.siteUrl, options.indexable) });
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source: createSitemap(options.siteUrl, routes) });
  },
});
