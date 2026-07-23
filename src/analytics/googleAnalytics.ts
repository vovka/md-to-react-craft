import { analyticsConfig, isAnalyticsEligible, isGa4IdValid } from "@/config/analytics";
import { loadAnalyticsScript } from "./scriptLoader";
import type { AnalyticsParameters } from "./types";

const SCRIPT_ID = "blog-ga4";
let defaultConsentApplied = false;

const setGoogleCollectionDisabled = (disabled: boolean) => {
  const key = `ga-disable-${analyticsConfig.ga4MeasurementId}`;
  (window as unknown as Record<string, unknown>)[key] = disabled;
};

const consentSettings = (analytics: "denied" | "granted") => ({
  ad_storage: "denied",
  analytics_storage: analytics,
  ad_user_data: "denied",
  ad_personalization: "denied",
});

const ensureGtag = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    // gtag.js consumes Arguments objects; a rest-parameter array prevents tag initialization.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
};

export const prepareGoogleConsent = () => {
  if (navigator.globalPrivacyControl || !isAnalyticsEligible() || !isGa4IdValid() || defaultConsentApplied) return;
  ensureGtag();
  window.gtag?.("consent", "default", consentSettings("denied"));
  defaultConsentApplied = true;
};

export const updateGoogleConsent = (granted: boolean) => {
  setGoogleCollectionDisabled(!granted);
  prepareGoogleConsent();
  window.gtag?.("consent", "update", consentSettings(granted ? "granted" : "denied"));
};

export const initializeGoogleAnalytics = () => {
  if (!isGa4IdValid()) return false;
  prepareGoogleConsent();
  window.gtag?.("js", new Date());
  window.gtag?.("config", analyticsConfig.ga4MeasurementId, {
    send_page_view: false,
    anonymize_ip: true,
    debug_mode: analyticsConfig.environment !== "production",
  });
  const id = encodeURIComponent(analyticsConfig.ga4MeasurementId);
  loadAnalyticsScript(SCRIPT_ID, `https://www.googletagmanager.com/gtag/js?id=${id}`);
  return true;
};

export const sendGoogleEvent = (name: string, parameters: AnalyticsParameters) => {
  window.gtag?.("event", name, parameters);
};

export const resetGoogleConsentState = () => { defaultConsentApplied = false; };
