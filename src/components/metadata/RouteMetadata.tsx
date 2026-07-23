import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { resolveRouteMetadata } from "@/metadata/routeMetadata";

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) { element = document.createElement("meta"); document.head.appendChild(element); }
  element.setAttribute(attribute, key);
  element.content = content;
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = href;
};

const RouteMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = resolveRouteMetadata(pathname);
    const canonical = new URL(metadata.canonicalPath, siteConfig.baseUrl).href;
    const robots = metadata.noIndex || !siteConfig.indexable ? "noindex, nofollow" : "index, follow";
    const image = metadata.image || `${siteConfig.baseUrl}/favicon.ico`;
    document.title = metadata.title;
    setCanonical(canonical);
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", robots);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:type", metadata.type || "website");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:image", image);
  }, [pathname]);

  return null;
};

export default RouteMetadata;
