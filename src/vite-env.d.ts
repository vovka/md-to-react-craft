/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_ANALYTICS_ENVIRONMENT?: string;
  readonly VITE_ANALYTICS_ALLOWED_HOSTS?: string;
  readonly VITE_ANALYTICS_GA4_MEASUREMENT_ID?: string;
  readonly VITE_ANALYTICS_CLARITY_PROJECT_ID?: string;
  readonly VITE_ANALYTICS_CONSENT_REQUIRED?: string;
  readonly VITE_ANALYTICS_CONSENT_STORAGE_KEY?: string;
  readonly VITE_ANALYTICS_POLICY_VERSION?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ROBOTS_INDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
