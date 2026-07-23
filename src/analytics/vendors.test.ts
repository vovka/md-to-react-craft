import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/analytics", () => ({
  analyticsConfig: {
    environment: "test",
    ga4MeasurementId: "G-TEST123",
    clarityProjectId: "clarity123",
  },
  isAnalyticsEligible: () => true,
  isGa4IdValid: () => true,
  isClarityIdValid: () => true,
}));

import { initializeClarity, stopClarity } from "./clarity";
import { clearGoogleAnalyticsCookies } from "./cookies";
import {
  initializeGoogleAnalytics,
  prepareGoogleConsent,
  resetGoogleConsentState,
  updateGoogleConsent,
} from "./googleAnalytics";

const googleCommands = () => (window.dataLayer || [])
  .map((command) => Array.from(command as ArrayLike<unknown>));

describe("analytics vendors", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: false });
    document.head.querySelectorAll("script").forEach((script) => script.remove());
    delete window.gtag;
    delete window.dataLayer;
    delete window.clarity;
    resetGoogleConsentState();
  });

  it("does not prepare a Google provider while GPC is active", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
    prepareGoogleConsent();
    expect(window.gtag).toBeUndefined();
    expect(window.dataLayer).toBeUndefined();
  });

  it("queues all denied Consent Mode v2 defaults before update and config", () => {
    prepareGoogleConsent();
    updateGoogleConsent(true);
    initializeGoogleAnalytics();
    const commands = googleCommands();
    expect(commands[0]).toEqual(["consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    }]);
    expect(commands[1]?.slice(0, 2)).toEqual(["consent", "update"]);
    expect(commands.findIndex((command) => command[0] === "config")).toBeGreaterThan(1);
  });

  it("queues canonical Arguments objects instead of arrays", () => {
    prepareGoogleConsent();
    const queued = window.dataLayer?.[0];
    expect(Array.isArray(queued)).toBe(false);
    expect(Object.prototype.toString.call(queued)).toBe("[object Arguments]");
    expect(Array.from(queued as ArrayLike<unknown>).slice(0, 2)).toEqual(["consent", "default"]);
  });

  it("toggles the GA hard-disable flag on revoke and acceptance", () => {
    updateGoogleConsent(false);
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(true);
    updateGoogleConsent(true);
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(false);
  });

  it("uses the exact Clarity consentv2 field casing", () => {
    initializeClarity();
    expect(window.clarity?.q?.[0]).toEqual(["consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "granted",
    }]);
  });

  it("stops Clarity collection on revoke and starts it on same-page reacceptance", () => {
    initializeClarity();
    stopClarity();
    initializeClarity();
    const commands = window.clarity?.q as unknown[][];
    expect(commands.filter((command) => command[0] === "stop")).toHaveLength(1);
    expect(commands.filter((command) => command[0] === "start")).toHaveLength(2);
    const stopIndex = commands.findIndex((command) => command[0] === "stop");
    expect(commands[stopIndex - 1]).toEqual(["consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    }]);
    expect(commands[stopIndex + 1]?.[0]).toBe("consentv2");
    expect(commands[stopIndex + 2]).toEqual(["start"]);
    expect(document.querySelectorAll("#blog-clarity")).toHaveLength(1);
  });

  it("clears current-host and parent-domain GA cookies", () => {
    document.cookie = "_ga_local=value; Path=/";
    document.cookie = "_ga_parent=value; Domain=.shcherbyna.me; Path=/";
    document.cookie = "essential=value; Path=/";
    clearGoogleAnalyticsCookies();
    expect(document.cookie).not.toContain("_ga_local");
    expect(document.cookie).not.toContain("_ga_parent");
    expect(document.cookie).toContain("essential=value");
  });
});
