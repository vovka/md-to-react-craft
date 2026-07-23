import { sendClarityEvent } from "./clarity";
import { sendGoogleEvent } from "./googleAnalytics";
import { isAnalyticsActive } from "./runtime";
import type { AnalyticsParameters } from "./types";

export const trackEvent = (name: string, parameters: AnalyticsParameters = {}) => {
  if (!isAnalyticsActive()) return;
  sendGoogleEvent(name, parameters);
  sendClarityEvent(name);
};

export const trackPageView = (path: string) => trackEvent("page_view", {
  page_path: path,
  page_location: window.location.href,
  page_title: document.title,
});

export const trackArticleScroll = (slug: string, percentage: number) => trackEvent("article_scroll", {
  article_slug: slug,
  percent_scrolled: percentage,
});

export const trackArticleRead = (slug: string, readingTime: string) => trackEvent("article_read", {
  article_slug: slug,
  reading_time: readingTime,
});

export const trackOutboundClick = (slug: string, target: URL) => trackEvent("outbound_click", {
  article_slug: slug,
  link_domain: target.hostname,
  link_url: `${target.origin}${target.pathname}`,
});

export const trackDialogueToggle = (slug: string, visible: boolean) => trackEvent("dialogue_toggle", {
  article_slug: slug,
  second_opinion_visible: visible,
});
