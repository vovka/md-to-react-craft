import { beforeEach, describe, expect, it, vi } from "vitest";

const vendors = vi.hoisted(() => ({
  initializeClarity: vi.fn(() => true),
  initializeGoogleAnalytics: vi.fn(() => true),
}));
vi.mock("@/config/analytics", () => ({ isAnalyticsEligible: () => true }));
vi.mock("./clarity", () => ({
  ...vendors,
  stopClarity: vi.fn(),
}));
vi.mock("./googleAnalytics", () => ({
  ...vendors,
  updateGoogleConsent: vi.fn(),
}));
vi.mock("./cookies", () => ({ clearGoogleAnalyticsCookies: vi.fn() }));

import { initializeAnalytics } from "./runtime";

describe("analytics runtime", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: false });
  });

  it("cannot initialize either provider while GPC is active", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
    expect(initializeAnalytics()).toBe(false);
    expect(vendors.initializeGoogleAnalytics).not.toHaveBeenCalled();
    expect(vendors.initializeClarity).not.toHaveBeenCalled();
  });
});
