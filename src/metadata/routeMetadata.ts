import { getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: "article" | "website";
  noIndex?: boolean;
}

const staticRoutes: Record<string, RouteMetadata> = {
  "/": { title: siteConfig.name, description: siteConfig.defaultDescription, canonicalPath: "/" },
  "/about": {
    title: `About | ${siteConfig.name}`,
    description: "About Volodymyr Shcherbyna and this technology blog.",
    canonicalPath: "/about",
  },
  "/contact": {
    title: `Contact | ${siteConfig.name}`,
    description: "Contact Volodymyr Shcherbyna about the blog.",
    canonicalPath: "/contact",
  },
  "/privacy": {
    title: `Privacy | ${siteConfig.name}`,
    description: "Analytics, consent, retention, and privacy details for this blog.",
    canonicalPath: "/privacy",
  },
};

export const resolveRouteMetadata = (pathname: string): RouteMetadata => {
  if (staticRoutes[pathname]) return staticRoutes[pathname];
  const post = getPostBySlug(decodeURIComponent(pathname.replace(/^\//, "")));
  if (post) return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    canonicalPath: `/${post.slug}`,
    image: post.coverImage,
    type: "article",
  };
  return {
    title: `Page not found | ${siteConfig.name}`,
    description: "The requested page could not be found.",
    canonicalPath: pathname,
    noIndex: true,
  };
};
