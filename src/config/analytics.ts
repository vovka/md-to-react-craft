export const analyticsConfig = {
  enabled: false,
  environment: "production",
  allowedHosts: ["blog.shcherbyna.me"],
  ga4MeasurementId: "",
  clarityProjectId: "",
  consent: {
    required: true,
    storageKey: "blog.analyticsConsent",
    policyVersion: "1",
    privacyPagePath: "/privacy",
  },
} as const;
