const env = import.meta.env;

const allowedHosts = (env.VITE_ANALYTICS_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

export const analyticsConfig = {
  enabled: env.VITE_ANALYTICS_ENABLED === "true",
  environment: env.VITE_ANALYTICS_ENVIRONMENT || "local",
  allowedHosts,
  ga4MeasurementId: env.VITE_ANALYTICS_GA4_MEASUREMENT_ID || "",
  clarityProjectId: env.VITE_ANALYTICS_CLARITY_PROJECT_ID || "",
  consent: {
    required: env.VITE_ANALYTICS_CONSENT_REQUIRED !== "false",
    storageKey: env.VITE_ANALYTICS_CONSENT_STORAGE_KEY || "blog.analyticsConsent",
    policyVersion: env.VITE_ANALYTICS_POLICY_VERSION || "1",
    privacyPagePath: "/privacy",
  },
} as const;

export const isGa4IdValid = (id = analyticsConfig.ga4MeasurementId) => /^G-[A-Z0-9]+$/i.test(id);
export const isClarityIdValid = (id = analyticsConfig.clarityProjectId) => /^[a-z0-9]+$/i.test(id);

export const isAnalyticsHostAllowed = () => {
  if (typeof window === "undefined") return false;
  return analyticsConfig.allowedHosts.includes(window.location.hostname.toLowerCase());
};

export const isAnalyticsEligible = () => analyticsConfig.enabled && isAnalyticsHostAllowed();
