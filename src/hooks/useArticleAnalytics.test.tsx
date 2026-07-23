import { type RefObject, useRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const events = vi.hoisted(() => ({
  trackArticleRead: vi.fn(),
  trackArticleScroll: vi.fn(),
  trackOutboundClick: vi.fn(),
}));
vi.mock("@/analytics/events", () => events);
vi.mock("@/analytics/runtime", () => ({ isAnalyticsActive: () => true }));

import { useArticleAnalytics } from "./useArticleAnalytics";

const Article = () => {
  const ref = useRef<HTMLElement>(null);
  useArticleAnalytics(ref as RefObject<HTMLElement>, "sample", "3 min read");
  return (
    <article ref={ref}>
      <a href="https://example.com/path?private=value" onClick={(event) => event.preventDefault()}>
        <span>External</span>
      </a>
    </article>
  );
};

describe("useArticleAnalytics", () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: -1000,
      height: 1000,
      bottom: 0,
      left: 0,
      right: 0,
      width: 1000,
      x: 0,
      y: -1000,
      toJSON: () => ({}),
    });
  });

  it("tracks scroll milestones, completed reading, and sanitized outbound clicks once", () => {
    render(<Article />);
    fireEvent.scroll(window);
    expect(events.trackArticleScroll).toHaveBeenCalledTimes(4);
    expect(events.trackArticleRead).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("External"));
    expect(events.trackOutboundClick).toHaveBeenCalledWith(
      "sample",
      expect.objectContaining({ hostname: "example.com" }),
    );
  });
});
