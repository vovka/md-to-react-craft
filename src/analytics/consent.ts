import { analyticsConfig } from "@/config/analytics";
import type { ConsentValue, StoredConsent } from "./types";

export const hasGlobalPrivacyControl = () => navigator.globalPrivacyControl === true;

const readStoredValue = () => {
  try {
    return localStorage.getItem(analyticsConfig.consent.storageKey);
  } catch {
    return null;
  }
};

const parseConsent = (value: string | null): StoredConsent | null => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const readConsent = (): ConsentValue => {
  if (hasGlobalPrivacyControl()) return "rejected";
  if (!analyticsConfig.consent.required) return "accepted";
  const stored = parseConsent(readStoredValue());
  if (stored?.policyVersion !== analyticsConfig.consent.policyVersion) return "unknown";
  return stored.analytics === "accepted" || stored.analytics === "rejected" ? stored.analytics : "unknown";
};

export const saveConsent = (analytics: Exclude<ConsentValue, "unknown">) => {
  const stored: StoredConsent = {
    analytics,
    policyVersion: analyticsConfig.consent.policyVersion,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(analyticsConfig.consent.storageKey, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
};
