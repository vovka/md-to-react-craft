import { isAnalyticsEligible } from "@/config/analytics";
import { hasGlobalPrivacyControl } from "./consent";
import { clearGoogleAnalyticsCookies } from "./cookies";
import { initializeClarity, stopClarity } from "./clarity";
import {
  initializeGoogleAnalytics,
  updateGoogleConsent,
} from "./googleAnalytics";

let active = false;

export const initializeAnalytics = () => {
  if (!isAnalyticsEligible() || hasGlobalPrivacyControl()) return false;
  updateGoogleConsent(true);
  const googleActive = initializeGoogleAnalytics();
  const clarityActive = initializeClarity();
  active = googleActive || clarityActive;
  return active;
};

export const disableAnalytics = () => {
  active = false;
  updateGoogleConsent(false);
  stopClarity();
  clearGoogleAnalyticsCookies();
};

export const isAnalyticsActive = () => active;
export const resetAnalyticsRuntime = () => { active = false; };
