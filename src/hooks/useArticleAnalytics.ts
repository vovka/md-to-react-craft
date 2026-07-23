import { type RefObject, useEffect, useRef } from "react";
import {
  trackArticleRead,
  trackArticleScroll,
  trackOutboundClick,
} from "@/analytics/events";
import { isAnalyticsActive } from "@/analytics/runtime";

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

const articleProgress = (article: HTMLElement) => {
  const bounds = article.getBoundingClientRect();
  const visibleDistance = window.innerHeight - bounds.top;
  return Math.max(0, Math.min(100, Math.round((visibleDistance / bounds.height) * 100)));
};

export const useArticleAnalytics = (
  articleRef: RefObject<HTMLElement>,
  slug: string,
  readingTime: string,
) => {
  const seenThresholds = useRef(new Set<number>());
  const readTracked = useRef(false);

  useEffect(() => {
    seenThresholds.current.clear();
    readTracked.current = false;
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!slug || !articleRef.current || !isAnalyticsActive()) return;
      const progress = articleProgress(articleRef.current);
      SCROLL_THRESHOLDS.filter((value) => value <= progress).forEach((value) => {
        if (seenThresholds.current.has(value)) return;
        seenThresholds.current.add(value);
        trackArticleScroll(slug, value);
      });
      if (progress >= 90 && !readTracked.current) {
        readTracked.current = true;
        trackArticleRead(slug, readingTime);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleRef, readingTime, slug]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article || !slug) return;
    const handleClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target.closest("a") : null;
      if (!element?.getAttribute("href")) return;
      const target = new URL(element.href, window.location.href);
      if (target.origin !== window.location.origin) trackOutboundClick(slug, target);
    };
    article.addEventListener("click", handleClick);
    return () => article.removeEventListener("click", handleClick);
  }, [articleRef, slug]);
};
