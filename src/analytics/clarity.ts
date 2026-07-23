import { analyticsConfig, isClarityIdValid } from "@/config/analytics";
import { loadAnalyticsScript } from "./scriptLoader";

const SCRIPT_ID = "blog-clarity";

const ensureClarity = () => {
  window.clarity = window.clarity || function clarity(...args: unknown[]) {
    window.clarity!.q = window.clarity!.q || [];
    window.clarity!.q.push(args);
  };
};

export const updateClarityConsent = (granted: boolean) => {
  if (!granted && !window.clarity) return;
  ensureClarity();
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: granted ? "granted" : "denied",
  });
};

export const initializeClarity = () => {
  if (!isClarityIdValid()) return false;
  updateClarityConsent(true);
  window.clarity?.("start");
  const id = encodeURIComponent(analyticsConfig.clarityProjectId);
  loadAnalyticsScript(SCRIPT_ID, `https://www.clarity.ms/tag/${id}`);
  window.clarity?.("set", "environment", analyticsConfig.environment);
  return true;
};

export const sendClarityEvent = (name: string) => window.clarity?.("event", name);
export const stopClarity = () => {
  updateClarityConsent(false);
  window.clarity?.("stop");
};
