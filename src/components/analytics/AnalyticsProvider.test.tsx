import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter } from "react-router-dom";

const runtime = vi.hoisted(() => ({
  disableAnalytics: vi.fn(),
  initializeAnalytics: vi.fn(() => true),
}));
const events = vi.hoisted(() => ({ trackPageView: vi.fn() }));
const configState = vi.hoisted(() => ({ eligible: true }));

vi.mock("@/config/analytics", () => ({
  analyticsConfig: {
    consent: {
      required: true,
      storageKey: "provider.consent",
      policyVersion: "1",
      privacyPagePath: "/privacy",
    },
  },
  isAnalyticsEligible: () => configState.eligible,
}));
vi.mock("@/analytics/runtime", () => runtime);
vi.mock("@/analytics/events", () => events);

import AnalyticsProvider from "./AnalyticsProvider";
import { useAnalyticsPreferences } from "./AnalyticsContext";

const Preferences = () => {
  const analytics = useAnalyticsPreferences();
  return <button onClick={analytics.openPreferences}>Open preferences</button>;
};

const TestApp = () => (
  <MemoryRouter
    initialEntries={["/"]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <AnalyticsProvider>
      <Link to="/about?source=test">About</Link>
      <Preferences />
    </AnalyticsProvider>
  </MemoryRouter>
);

const saveChoice = (analytics: "accepted" | "rejected") => localStorage.setItem(
  "provider.consent",
  JSON.stringify({ analytics, policyVersion: "1", updatedAt: new Date().toISOString() }),
);

const setGpc = (value: boolean) => Object.defineProperty(navigator, "globalPrivacyControl", {
  configurable: true,
  value,
});

describe("AnalyticsProvider", () => {
  beforeEach(() => { localStorage.clear(); setGpc(false); configState.eligible = true; });
  afterEach(cleanup);

  it("initializes saved acceptance and sends one page view per route", async () => {
    saveChoice("accepted");
    render(<TestApp />);
    await waitFor(() => expect(events.trackPageView).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText("About"));
    await waitFor(() => expect(events.trackPageView).toHaveBeenCalledTimes(2));
    expect(events.trackPageView).toHaveBeenLastCalledWith("/about?source=test");
    expect(runtime.initializeAnalytics).toHaveBeenCalledTimes(1);
  });

  it("renders no controls and initializes nothing when analytics is disabled", () => {
    configState.eligible = false;
    render(<TestApp />);
    expect(screen.queryByText("Accept analytics")).toBeNull();
    expect(runtime.initializeAnalytics).not.toHaveBeenCalled();
  });

  it("saves rejection without activating providers", () => {
    render(<TestApp />);
    fireEvent.click(screen.getByText("Reject analytics"));
    expect(JSON.parse(localStorage.getItem("provider.consent")!).analytics).toBe("rejected");
    expect(runtime.initializeAnalytics).not.toHaveBeenCalled();
  });

  it("keeps GPC immutable when preferences are reopened", () => {
    saveChoice("accepted");
    setGpc(true);
    render(<TestApp />);
    fireEvent.click(screen.getByText("Open preferences"));
    expect(screen.getByText(/Global Privacy Control/)).toBeTruthy();
    expect(screen.queryByText("Accept analytics")).toBeNull();
    expect(runtime.initializeAnalytics).not.toHaveBeenCalled();
  });
});
