import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/analytics", () => ({
  analyticsConfig: {
    consent: { required: true, storageKey: "test.consent", policyVersion: "2" },
  },
}));

import { readConsent, saveConsent } from "./consent";

const setGpc = (value: boolean) => Object.defineProperty(navigator, "globalPrivacyControl", {
  configurable: true,
  value,
});

describe("consent storage", () => {
  beforeEach(() => { localStorage.clear(); setGpc(false); });

  it("saves and restores the current policy choice", () => {
    expect(saveConsent("accepted")).toBe(true);
    expect(readConsent()).toBe("accepted");
  });

  it("ignores consent from an older policy", () => {
    localStorage.setItem("test.consent", JSON.stringify({ analytics: "accepted", policyVersion: "1" }));
    expect(readConsent()).toBe("unknown");
  });

  it("makes GPC override saved acceptance", () => {
    saveConsent("accepted");
    setGpc(true);
    expect(readConsent()).toBe("rejected");
  });

  it("tolerates blocked local storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(readConsent()).toBe("unknown");
    expect(saveConsent("rejected")).toBe(false);
  });
});
