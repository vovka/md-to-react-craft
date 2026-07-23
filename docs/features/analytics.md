# Consent-Gated Analytics

## Overview

The blog loads GA4 and Microsoft Clarity only on an allowed host after analytics consent. Local/test and
production builds use separate environment-backed IDs. Configuration is disabled and non-indexable by default.

## Purpose

This feature provides privacy-safe SPA analytics, reusable preferences, route metadata, and article engagement
events without mixing test traffic into production dashboards.

## Key Files And Structure

- `src/config/analytics.ts`: environment parsing, host allowlist, and ID validation.
- `src/analytics/consent.ts`: versioned consent storage and Global Privacy Control handling.
- `src/analytics/googleAnalytics.ts`: Consent Mode v2, GA tag loading, and events.
- `src/analytics/clarity.ts`: Clarity loading, consentv2, environment tag, and events.
- `src/analytics/runtime.ts`: vendor activation and revocation.
- `src/components/analytics/AnalyticsProvider.tsx`: banner state and deduplicated SPA page views.
- `src/hooks/useArticleAnalytics.ts`: scroll, completed-read, and outbound-link tracking.
- `src/components/metadata/RouteMetadata.tsx`: title, canonical, robots, OG, and Twitter metadata.
- `build/siteFiles.ts`: build-time root metadata, robots policy, and route/post sitemap generation.
- `vite.config.ts`: connects environment profiles to generated site files.

## Core Concepts

Google's four Consent Mode v2 values are queued as denied synchronously in `src/main.tsx`, before a tag or
config command. Acceptance updates only `analytics_storage` to granted; all advertising fields remain denied.
Clarity uses `consentv2` with exact `ad_Storage` and `analytics_Storage` casing.

GPC overrides saved and interactive acceptance for the entire page session. Rejection or revocation stops new
events, sets Google's `ga-disable-*` hard stop, sends denied consent, issues Clarity `stop`, and expires
`_ga*` cookies on the current host and safe `shcherbyna.me` parent domain. Reacceptance
clears Google's hard stop and grants consent before events; Clarity receives granted consent and `start`.

## How It Works

1. The synchronous bootstrap queues denied Google consent when config, ID, and host are valid.
2. `AnalyticsProvider` reads the current policy-version choice.
3. Unknown consent shows the banner; rejected consent leaves vendors inactive.
4. Accepted consent updates vendor consent before loading either tag.
5. Route changes emit one manual `page_view`, including the query string.
6. Article views emit `article_scroll`, `article_read`, `outbound_click`, and `dialogue_toggle` as applicable.
7. The footer preference button reopens choices so acceptance can be revoked.
8. Each build emits `/sitemap.xml` for static canonical routes and every Markdown post.

## Configuration

- `VITE_ANALYTICS_ENABLED`: false by default; enable only for an approved build.
- `VITE_ANALYTICS_ENVIRONMENT`: `local`, `test`, or `production`.
- `VITE_ANALYTICS_ALLOWED_HOSTS`: comma-separated exact hostnames.
- `VITE_ANALYTICS_GA4_MEASUREMENT_ID`: use the test stream locally/test and production stream in production.
- `VITE_ANALYTICS_CLARITY_PROJECT_ID`: use the test project locally/test and production project in production.
- `VITE_ANALYTICS_POLICY_VERSION`: increment when the consent policy materially changes.
- `VITE_SITE_URL`: exact origin used by canonical and social metadata.
- `VITE_ROBOTS_INDEX`: false for local/test and true only for production.

Use ignored `.env.local` for local testing. Deployment reads the same names from GitHub Actions variables.
Never use production vendor IDs for localhost or the test host.

## Integration Points

GA4 Enhanced Measurement must have history-based page changes disabled because the app emits manual SPA page
views. GA4 retention is 14 months. Clarity dashboard retention is up to 30 days. Search Console uses separate
URL-prefix properties and DNS verification; it has no runtime credential. Both profiles expose their own
canonical sitemap, while the test profile remains `noindex` and disallowed in `robots.txt`.

## Testing Strategy

Run `npm test`, `npm run build`, and targeted ESLint on the changed feature paths. Tests cover disabled and
invalid config, versioned consent, blocked storage, GPC immutability, Consent Mode ordering, Clarity casing,
cookie cleanup, SPA page views, metadata, article engagement, and outbound URL sanitization.

For browser verification, use test IDs on localhost, accept consent, navigate routes, and confirm GA DebugView
and Clarity live activity. Then reject through footer preferences and verify collection stops.

## Important Patterns And Pitfalls

- The `gtag` shim must push its normal function `arguments` object; queuing a rest-parameter array breaks GA.
- IDs are public identifiers but must remain separate to prevent mixed datasets.
- Keep the confirmed controller identity and monitored privacy contact current.
- The test build must stay non-indexable.
- Article route metadata is client-rendered; full per-article social previews would need prerendering or SSR.
- The existing application bundle exceeds Vite's 500 kB advisory threshold; this change does not address it.

---
Last updated: 2026-07-23
