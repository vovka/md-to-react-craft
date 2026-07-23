const configuredUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "Volodymyr Shcherbyna's Blog",
  defaultDescription: "Articles about software development, AI, architecture, and practical technology.",
  baseUrl: configuredUrl || "https://blog.shcherbyna.me",
  indexable: import.meta.env.VITE_ROBOTS_INDEX === "true",
} as const;
