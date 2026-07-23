export type ConsentValue = "unknown" | "accepted" | "rejected";
export type AnalyticsParameters = Record<string, boolean | number | string>;

export interface StoredConsent {
  analytics: Exclude<ConsentValue, "unknown">;
  policyVersion: string;
  updatedAt: string;
}

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }

  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
